from typing import List, Text, Optional
from pydantic import BaseModel

class TestcaseCreate(BaseModel):
    testcase_id: str
    problem_id: int
    testcase_number: int
    args_file_content: Text = ''
    stdin_file_content: Text = ''
    answer_file_content: Text = ''

class TestcaseWithPathCreate(BaseModel):
    problem_id: int
    testcase_number: int
    args_file_path: str
    stdin_file_path: str
    input_file_path: str
    output_file_name: str
    answer_file_path: str

class TestcaseResponse(BaseModel):
    testcase_number: int
    args_file_content: Text
    stdin_file_content: Text
    answer_file_content: Text
    input_file_content: Optional[Text] = None
