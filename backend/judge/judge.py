import os
from utils.get_root_dir import get_root_dir
import constants
import execute
import makefile

def judge():
    root_dir: str = get_root_dir()
    exec_dir: str = os.path.join(root_dir, constants.EXEC_DIR)
    judge_dir: str = os.path.join(root_dir, constants.JUDGE_DIR)
    test_dir: str = os.path.join(root_dir, constants.TEST_DIR)
    if not makefile.have_makefile(exec_dir):
        makefile.copy_makefile(exec_dir, os.path.join(judge_dir, constants.MAKEFILE_FILENAME))

    # compile
    if not execute.compile(exec_dir, constants.COMPILE_DELAY):
        print(constants.judge_results.CE.value)
        return

    executable_path: str = os.path.join(exec_dir, constants.PROG)

    # just for test
    test_c1_dir = os.path.join(test_dir, "c/c1")
    for dirs in os.listdir(test_c1_dir):
        input_path = os.path.join(test_c1_dir, dirs, "input.txt")
        output_path = os.path.join(test_c1_dir, dirs, "output.txt")
        command: str = f"{executable_path} < {input_path}"
        result = execute.execute_command(command, constants.EXECUTE_DELAY)
        if result == constants.judge_results.RE.value:
            print(constants.judge_results.RE.value)
            continue
        elif result == constants.judge_results.TLE.value:
            print(constants.judge_results.TLE.value)
            continue
        with open(output_path, "r") as f:
            expected_output = f.read()
            if not execute.judgeResult(result, expected_output):
                print(constants.judge_results.WA.value)
            else:
                print(constants.judge_results.AC.value)
    return

if __name__ == "__main__":
    judge()
