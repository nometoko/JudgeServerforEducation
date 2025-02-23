import os
from typing import List
from utils.get_root_dir import get_root_dir
import judge.constants as constants
import judge.execute as execute
import judge.makefile as makefile

from app import schemas

async def judge(submission_id: str, testcases_with_path: List[schemas.TestcaseWithPathCreate]) -> List[schemas.SubmissionResultCreate]:

    exec_dir = os.getenv("EXEC_DIR")
    files_dir_path: str = os.path.join(exec_dir, submission_id)

    if not makefile.have_makefile(files_dir_path):
        makefile.copy_makefile(files_dir_path, os.path.join(files_dir_path, "../Makefile"))

    # compile
    try:
        execute.compile(files_dir_path, constants.COMPILE_DELAY)
    except Exception as e:
        raise e

    executable_path: str = os.path.join(files_dir_path, constants.PROG)
    static_dir = os.getenv("STATIC_DIR")

    create_submission_result_list: List[schemas.SubmissionResultCreate] = []

    for testcase_with_path in testcases_with_path:
        command = f"{executable_path}"
        if testcase_with_path.args_file_path:
            arg_path = os.path.join(static_dir, testcase_with_path.args_file_path)
            with open(arg_path) as f:
                arg_content = f.read()
            command = command = f"{command} {arg_content}"
        
        if testcase_with_path.stdin_file_path:
            stdin_path = os.path.join(static_dir, testcase_with_path.stdin_file_path)
            command = f"{command} < {stdin_path}"

        output = execute.execute_command(command, constants.EXECUTE_DELAY)
        
        answer_path = os.path.join(static_dir, testcase_with_path.answer_file_path)
        with open(answer_path) as f:
            answer_content = f.read()

        status = None
        try:
            result = execute.judgeResult(output, answer_content)
            if result:
                status = constants.judge_results.AC.value
            else:
                status = constants.judge_results.WA.value

        except TimeoutError:
            status = constants.judge_results.TLE.value
        except RuntimeError:
            status = constants.judge_results.RE.value

        create_submission_result = schemas.SubmissionResultCreate(
            status=status,
            submission_id=submission_id,
            testcase_number=testcase_with_path.testcase_number,
            output_content=output
        )
        create_submission_result_list.append(create_submission_result)
    
    command = f"make clean -C {files_dir_path}"
    execute.execute_command(command, constants.EXECUTE_DELAY)

    return create_submission_result_list
