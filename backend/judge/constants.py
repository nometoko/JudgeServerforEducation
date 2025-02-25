from enum import Enum

PROG: str = "prog"
JUDGE_DIR: str = "backend/judge"
EXEC_DIR: str = "compile_resource"
TEST_DIR: str = "static/testcases"

MAKEFILE_FILENAME: str = "Makefile"

COMPILE_DELAY: int = 2 # seconds
EXECUTE_DELAY: int = 1000 # milliseconds

class judge_results(Enum):
    AC = "AC"
    WA = "WA"
    TLE = "TLE"
    RE = "RE"
    CE = "CE"
