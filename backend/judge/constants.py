from enum import Enum
from typing import List

PROG: str = "prog"
PROG_DEBUG: str = "prog_debug"
MAKEFILE_FILENAME: str = "Makefile"

COMPILE_DELAY: int = 2 # seconds
EXECUTE_DELAY: int = 1000 # milliseconds

class judge_results(Enum):
    # AC < ML < TLE < WA < RE < CE
    AC = "AC" # Accepted
    WA = "WA" # Wrong Answer
    TLE = "TLE" # Time Limit Exceeded
    RE = "RE" # Runtime Error
    CE = "CE" # Compile Error
    ME = "ME" # Memory Error

STATUS_PRIORITY: List[str] = [judge_results.AC.value, judge_results.ME.value, judge_results.TLE.value, judge_results.WA.value, judge_results.RE.value, judge_results.CE.value]
