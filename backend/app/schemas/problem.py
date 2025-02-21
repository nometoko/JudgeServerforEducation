from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ProblemCreate(BaseModel):
    problem_id: int
    is_petit_coder: bool
    name: str
    statement: str
    constraints: str
    execution_time: int
    memory_limit: int
    input_format: str
    output_format: str
    open_date: str
    close_date: str
    border_score: int

class ProblemResponse(BaseModel):
    problem_id: int
    is_petit_coder: bool
    name: str
    statement: str
    constraints: str
    execution_time: int
    memory_limit: int
    input_format: str
    output_format: str
    open_date: str
    close_date: str
    border_score: int
