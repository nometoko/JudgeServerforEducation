import os
from io import TextIOWrapper
from typing import List
import subprocess

import judge.makefile as makefile
import judge.constants as constants


def judgeResult(input: str, output: str) -> bool:
    input = input.strip()
    output = output.strip()
    return input == output


# only accept PROG for executable name
def get_executable(exec_dir: str) -> str:
    for file in os.listdir(exec_dir):
        # if file is executable
        if os.access(os.path.join(exec_dir, file), os.X_OK):
            return file

    raise ValueError("PROG not found in Makefile")


def compile(exec_dir: str) -> None:
    try:
        makefile.copy_makefile(exec_dir)
        subprocess.run(
            ["make", "-C", exec_dir], capture_output=True, text=True, check=True
        )
    except subprocess.CalledProcessError as e:
        raise RuntimeError(e.stderr)


def make_clean(exec_dir: str) -> None:
    try:
        subprocess.run(
            ["make", "clean", "-C", exec_dir],
            capture_output=True,
            text=True,
            check=True,
        )
    except subprocess.CalledProcessError as e:
        raise RuntimeError(e.stderr)

def execute_command(
    args: str,
    exec_dir: str,
    execute_delay: int = 10000000,
    input_file: TextIOWrapper | None = None,
) -> str:
    timeout: float = execute_delay / 1000

    execute_command = ["/bin/sh", "-c", f"./{constants.PROG}{args}"]
    execute_command_debug = ["/bin/sh", "-c", f"./{constants.PROG_DEBUG}{args}"]

    proc = None
    proc_debug = None

    try:
        if input_file:
            proc = subprocess.Popen(execute_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=input_file, cwd=exec_dir, text=True)
        else:
            proc = subprocess.Popen(execute_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=exec_dir, text=True)

        stdout, stderr = proc.communicate(timeout=timeout)
        if stderr:
            raise RuntimeError(stderr)

    except RuntimeError as e:
        raise RuntimeError(e)
    except subprocess.TimeoutExpired:
        if proc:
            proc.kill()
        raise TimeoutError
    except subprocess.CalledProcessError:
        if proc:
            proc.kill()
        raise RuntimeError("CalledProcessError")
    except UnicodeDecodeError:
        if proc:
            proc.kill()
        raise RuntimeError("UnicodeDecodeError")
    except Exception as e:
        if proc:
            proc.kill()
        raise RuntimeError(e)

    try:
        if input_file:
            proc_debug = subprocess.Popen(execute_command_debug, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=input_file, cwd=exec_dir, text=True)
        else:
            proc_debug = subprocess.Popen(execute_command_debug, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=exec_dir, text=True)

        stdout_debug, stderr_debug = proc_debug.communicate()
        if stderr_debug:
            raise RuntimeError(stderr_debug)

    except Exception as e:
        if proc_debug:
            proc_debug.kill()
        # address error
        raise MemoryError(e)

    # is_leak, leak_message = isLeaked(f"./{constants.PROG}{args}", exec_dir, input_file)
    # if is_leak:
        # raise MemoryError(leak_message)

    return stdout


def isLeaked(
    command: str,
    exec_dir: str,
    input_file: TextIOWrapper | None = None,
) -> tuple[bool, str]:

    leak_check_command = ["/bin/sh", "-c", f"valgrind --leak-check=full --error-exitcode=1 {command}"]
    proc = None

    try:
        if input_file:
            proc = subprocess.Popen(leak_check_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=input_file, cwd=exec_dir, text=True)
        else:
            proc = subprocess.Popen(leak_check_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=exec_dir, text=True)

        stdout, stderr = proc.communicate()
        print(proc.returncode)
        if proc.returncode != 0:
            return True, stderr

    except subprocess.CalledProcessError:
        if proc:
            proc.kill()
        raise RuntimeError("CalledProcessError")
    except UnicodeDecodeError:
        if proc:
            proc.kill()
        raise RuntimeError("UnicodeDecodeError")
    except Exception as e:
        if proc:
            proc.kill()
        raise RuntimeError(e)

    return False, ""
