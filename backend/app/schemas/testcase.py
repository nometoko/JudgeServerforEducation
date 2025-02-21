from typing import List
from pydantic import BaseModel

class TestcaseCreate(BaseModel):
    testcase_id: int
    args_file_path: str
    stdin_file_path: str
    input_file_path_list: List[str] = []
    output_file_name: str = ''
    answer_file_path: str
