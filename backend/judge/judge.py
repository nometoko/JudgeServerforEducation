import os
from typing import List
import judge.constants as constants
import judge.execute as execute
import judge.makefile as makefile

from app import schemas, models

async def judge(submission_id: str, testcases_with_path: List[models.TestcaseWithPath]) -> List[schemas.SubmissionResultCreate]:
    exec_dir = os.path.join(os.getenv("ROOT_DIR"), os.getenv("EXEC_DIR"))
    files_dir_path: str = os.path.join(exec_dir, submission_id)

    if not makefile.have_makefile(files_dir_path):
        makefile.copy_makefile(files_dir_path, os.path.join(files_dir_path, "../Makefile"))

    # compile
    try:
        execute.compile(files_dir_path, constants.COMPILE_DELAY)
    except Exception as e:
        raise e

    executable_path: str = f"./{constants.PROG}"
    static_dir = os.path.join(os.getenv("ROOT_DIR"), os.getenv("STATIC_DIR"))

    create_submission_result_list: List[schemas.SubmissionResultCreate] = []

    for testcase_with_path in testcases_with_path:
        command = executable_path
        input_file = None
        if testcase_with_path.args_file_path:
            arg_path = os.path.join(static_dir, testcase_with_path.args_file_path)
            with open(arg_path) as f:
                arg_content = f.read()
            for arg in arg_content.split():
                command += " " + arg

        if testcase_with_path.stdin_file_path:
            stdin_path = os.path.join(static_dir, testcase_with_path.stdin_file_path)
            input_file = open(stdin_path, "r")

        if testcase_with_path.input_file_path:
            input_path = os.path.join(static_dir, testcase_with_path.input_file_path)
            dist_path = os.path.join(files_dir_path, os.path.basename(input_path))
            if not os.path.exists(dist_path):
                os.symlink(input_path, dist_path)
            else:
                os.unlink(dist_path)
                os.symlink(input_path, dist_path)

        status = None
        try:
            if input_file:
                output = execute.execute_command(command, submission_id, constants.EXECUTE_DELAY, input_file)
                input_file.close()
            else:
                output = execute.execute_command(command, submission_id, constants.EXECUTE_DELAY)
            answer_path = os.path.join(static_dir, testcase_with_path.answer_file_path)
            with open(answer_path) as f:
                answer_content = f.read()

            result = execute.judgeResult(output, answer_content)
            if result:
                status = constants.judge_results.AC.value
            else:
                status = constants.judge_results.WA.value
        except TimeoutError:
            status = constants.judge_results.TLE.value
            output = ''
        except RuntimeError:
            status = constants.judge_results.RE.value
            output = ''

        create_submission_result = schemas.SubmissionResultCreate(
            status=status,
            submission_id=submission_id,
            testcase_number=testcase_with_path.testcase_number,
            output_content=output
        )
        create_submission_result_list.append(create_submission_result)

    execute.make_clean(files_dir_path)

    return create_submission_result_list
