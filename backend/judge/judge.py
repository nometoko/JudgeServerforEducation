import os
from typing import List
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
    try:
        exec_dir = os.path.join("..", os.getenv("EXEC_DIR"))
        files_dir_path: str = os.path.join(exec_dir, submission_id)

        executable_path: str = f"./{constants.PROG}"
        static_dir = os.path.join("..", os.getenv("STATIC_DIR"))

        submission_status = judge_results.AC.value

        testcases_with_path = crud.get_testcases_with_path_by_problem_id(db, problem_id)

        for testcase in testcases_with_path:
            command = executable_path
            stdin_file = None

            if testcase.args_file_path:
                arg_path = os.path.join(static_dir, testcase.args_file_path)
                with open(arg_path) as f:
                    arg_content = f.read()
                for arg in arg_content.split():
                    command += " " + arg

            if testcase.stdin_file_path:
                stdin_path = os.path.join(static_dir, testcase.stdin_file_path)
                stdin_file = open(stdin_path, "r")

            if testcase.input_file_path:
                input_path = os.path.join(static_dir, testcase.input_file_path)
                dist_path = os.path.join(files_dir_path, os.path.basename(input_path))

                if not os.path.exists(input_path):
                    print("os.pardir(input_path) not exists")
                    return None

                if not os.path.islink(dist_path):
                    # files_dir_pathからの相対パスで指定
                    os.symlink(os.path.join("..", input_path), dist_path)
                else:
                    os.unlink(dist_path)
                    # files_dir_pathからの相対パスで指定
                    os.symlink(os.path.join("..", input_path), dist_path)

            status = None
            try:
                if stdin_file:
                    output = execute.execute_command(command, submission_id, constants.EXECUTE_DELAY, stdin_file)
                    stdin_file.close()
                else:
                    output = execute.execute_command(command, submission_id, constants.EXECUTE_DELAY)

                if testcase.output_file_name:
                    output_path = os.path.join(files_dir_path, testcase.output_file_name)
                    if os.path.exists(output_path):
                        with open(output_path, "r") as f:
                            output = f.read()
                        os.remove(output_path)
                answer_path = os.path.join(static_dir, testcase.answer_file_path)
                with open(answer_path) as f:
                    answer_content = f.read()

                result = execute.judgeResult(output, answer_content)
                if result:
                    status = judge_results.AC.value
                else:
                    status = judge_results.WA.value
            except TimeoutError:
                status = judge_results.TLE.value
                output = ""
            except RuntimeError:
                status = judge_results.RE.value
                output = ""

            testcase_number = testcase.testcase_number
            update_submission_result = schemas.SubmissionResultUpdate(status=status, output_content=output)
            crud.update_submission_result(db, submission_id, testcase_number, update_submission_result)
            # statusの優先度: RE > WA > TLE > AC
            if submission_status == judge_results.AC.value:
                submission_status = status
            # elif status == "TLE" and testcase_result_status in ["RE", "WA"]:
            elif submission_status == judge_results.TLE.value and status in [judge_results.RE.value, judge_results.WA.value]:
                submission_status = status
            # elif status == "WA" and testcase_result_status == "RE":
            elif submission_status == judge_results.WA.value and status == judge_results.RE.value:
                submission_status = status

        execute.make_clean(files_dir_path)

        update_submission = schemas.SubmissionUpdate(status=submission_status)
        crud.update_submission_status(db, submission_id, update_submission)

    finally:
        db.close()
