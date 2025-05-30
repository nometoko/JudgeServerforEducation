import os, shutil
from typing import List
import chardet
from sqlalchemy.orm import Session

from judge.constants import judge_results
import judge.constants as constants
import judge.execute as execute
import judge.makefile as makefile

from app import schemas, models, crud
from app.api import deps
from app.api.api_v1 import endpoints


def judge(
    submission_id: str,
    problem_id: int,
    # db: Session
) -> None:
    db = next(deps.get_db())
    exec_dir = os.getenv("EXEC_DIR")
    if not exec_dir:
        return
    files_dir_path: str = os.path.join(exec_dir, submission_id)

    static_dir = os.getenv("STATIC_DIR")
    if not static_dir:
        return

    try:
        submission_status = judge_results.AC.value
        testcases_with_path = crud.get_testcases_with_path_by_problem_id(db, problem_id)

        for testcase in testcases_with_path:
            stdin_file = None
            args = ""

            if testcase.args_file_path:
                args_file_path = str(testcase.args_file_path)
                arg_path = os.path.join(static_dir, args_file_path)
                with open(arg_path) as f:
                    arg_content = f.read()
                for arg in arg_content.split():
                    args += " " + arg

            if testcase.stdin_file_path:
                stdin_file_path = str(testcase.stdin_file_path)
                stdin_path = os.path.join(static_dir, stdin_file_path)
                if not os.path.exists(stdin_path):
                    print("os.pardir(stdin_path) not exists")
                    return None
                stdin_file = open(stdin_path, "r")

            if testcase.input_file_path:
                input_path = str(testcase.input_file_path)
                input_path = os.path.join(static_dir, input_path)
                dist_path = os.path.join(files_dir_path, os.path.basename(input_path))

                if not os.path.exists(input_path):
                    print("os.pardir(input_path) not exists")
                    return None

                if not os.path.islink(dist_path):
                    os.symlink(input_path, dist_path)
                else:
                    os.unlink(dist_path)
                    os.symlink(input_path, dist_path)

            status = None
            try:
                execute_command_for_memory = ["/bin/sh", "-c", f"./{constants.PROG_DEBUG}{args}" ]
                output = execute.execute_command(execute_command_for_memory, files_dir_path, constants.EXECUTE_DELAY, True, stdin_file)

                if testcase.output_file_name:
                    filename = str(testcase.output_file_name)
                    output_path = os.path.join(files_dir_path, filename)
                    if os.path.exists(output_path):
                        with open(output_path, "rb") as f:
                            output = f.read()
                        chardet_result = chardet.detect(output)
                        encoding = chardet_result["encoding"]

                        with open(output_path, "r", encoding=encoding, errors="replace") as f:
                            output = f.read()
                        os.remove(output_path)

                answer_path = os.path.join(static_dir, str(testcase.answer_file_path))
                with open(answer_path) as f:
                    answer_content = f.read()

                if output is None:
                    status = judge_results.RE.value
                    raise RuntimeError("output is None")

                result = execute.judgeResult(output, answer_content)
                if result:
                    status = judge_results.AC.value
                else:
                    status = judge_results.WA.value

            except TimeoutError:
                status = judge_results.TLE.value
                output = ""
            except RuntimeError as e:
                status = judge_results.RE.value
                output = str(e)
            except MemoryError as e:
                status = judge_results.ME.value
                output = str(e)
            except Exception as e:
                status = judge_results.RE.value
                output = str(e)

            if stdin_file:
                stdin_file.close()

            testcase_number = testcase.testcase_number
            update_submission_result = schemas.SubmissionResultUpdate(status=status, output_content=output)

            crud.update_submission_result(db, submission_id, testcase_number, update_submission_result)

            # statusの優先度: RE > WA > TLE > ML > AC
            if constants.STATUS_PRIORITY.index(submission_status) < constants.STATUS_PRIORITY.index(status):
                submission_status = status

        execute.make_clean(files_dir_path)

        update_submission = schemas.SubmissionUpdate(status=submission_status)
        crud.update_submission_status(db, submission_id, update_submission)

    finally:
        db.close()
        if os.path.exists(files_dir_path) and os.getenv("BUCKET_NAME"):
            shutil.rmtree(files_dir_path)
