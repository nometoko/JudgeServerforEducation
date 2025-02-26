from enum import Enum

PROG: str = "prog"
MAKEFILE_FILENAME: str = "Makefile"

COMPILE_DELAY: int = 2 # seconds
EXECUTE_DELAY: int = 1000 # milliseconds

class judge_results(Enum):
    AC = "AC"
    WA = "WA"
    TLE = "TLE"
    RE = "RE"
    CE = "CE"
