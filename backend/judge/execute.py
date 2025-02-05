import os
import sys
import subprocess

import constants

def judgeResult(input: str, output: str) -> bool:
    input = input.rstrip('\n')
    output = output.rstrip('\n')
    return input == output

# only accept PROG for executable name
def get_prog_name(makefile_path: str) -> str:
    with open(makefile_path, "r") as f:
        lines = f.readlines()
        for line in reversed(lines):
            if line.startswith("PROG"):
                return line.split('=')[1].strip()
    raise ValueError("PROG not found in Makefile")

def compile(exec_dir: str, compile_delay: int) -> bool:
    command: str = f"make -C {exec_dir}"
    print(command)
    try:
        result = subprocess.run(command, shell=True, timeout=compile_delay)
    except subprocess.TimeoutExpired:
        print("Compile Timeout")
        return False
    except subprocess.CalledProcessError:
        print("Compile Error")
        return False
    return True

def execute_executable(command: str, execute_delay: int) -> str:
    timeout: float = execute_delay / 1000
    try:
        result = subprocess.run(command, shell=True, timeout=timeout, capture_output=True, text=True)
    except subprocess.TimeoutExpired:
        return constants.judge_results.TLE.value
    except subprocess.CalledProcessError:
        return constants.judge_results.RE.value
    return result.stdout
