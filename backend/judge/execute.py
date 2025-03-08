import os
from io import TextIOWrapper
from typing import List
import subprocess

import judge.makefile as makefile
import judge.constants


def judgeResult(input: str, output: str) -> bool:
    input = input.strip()
    output = output.strip()
    return input == output


# only accept PROG for executable name
def get_prog_name(makefile_path: str) -> str:
    with open(makefile_path, "r") as f:
        lines = f.readlines()
        for line in reversed(lines):
            if line.startswith("PROG"):
                return line.split("=")[1].strip()
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
    command: str,
    submission_id: str,
    execute_delay: int = 10000000,
    input_file: TextIOWrapper = None,
) -> str:
    timeout: float = execute_delay / 1000
    command = ["/bin/sh", "-c", command]
    exec_dir = f"../{os.getenv('EXEC_DIR')}/{submission_id}"

    try:
        if input_file:
            proc = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=input_file, cwd=exec_dir, text=True)
        else:
            proc = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=exec_dir, text=True)
        stdout, stderr = proc.communicate(timeout=timeout)
        if stderr:
            raise RuntimeError(stderr)
    except subprocess.TimeoutExpired:
        proc.kill()
        stdout, stderr = proc.communicate()
        print("timeout")
        raise TimeoutError
    except subprocess.CalledProcessError:
        proc.kill()
        raise RuntimeError
    except UnicodeDecodeError:
        proc.kill()
        raise RuntimeError
    except Exception as e:
        proc.kill()
        print(e)
        raise RuntimeError
    return stdout
