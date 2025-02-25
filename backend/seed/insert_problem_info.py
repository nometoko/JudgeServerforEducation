import json
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Text


from app import schemas, crud
from app.api import deps

class TestcaseWithoutId(BaseModel):
    problem_id: int
    testcase_number: int
    args_file_content: Text = ''
    stdin_file_content: Text = ''
    answer_file_content:Text = ''

class ProblemJson(BaseModel):
    problem: schemas.ProblemCreate
    testcases: List[TestcaseWithoutId]
    testcases_with_path: List[schemas.TestcaseWithPathCreate]

def read_json(seed_root_dir: str, json_file_name: str) -> List[ProblemJson]:
    json_file_path = f"{seed_root_dir}/{json_file_name}"
    with open(json_file_path, "r") as f:
        problems = json.load(f)
    problems_info = []
    for problem in problems:
        testcases_with_path = problem.pop("testcase_with_paths")
        problem_id = problem['problem_id']
        for testcase_with_path in testcases_with_path:
            testcase_with_path['problem_id'] = problem_id
            testcase_with_path['testcase_number'] = testcase_with_path.pop("testcase_id")

        testcases = [ testcase_with_path.copy() for testcase_with_path in testcases_with_path ]
        for testcase in testcases:
            args_file_path = testcase.pop("args_file_path")
            if args_file_path:
                with open(f"{seed_root_dir}/{args_file_path}", "r") as f:
                    testcase["args_file_content"] = f.read()
            stdin_file_path = testcase.pop("stdin_file_path")
            if stdin_file_path:
                with open(f"{seed_root_dir}/{stdin_file_path}", "r") as f:
                    testcase["stdin_file_content"] = f.read()
            answer_file_path = testcase.pop("answer_file_path")
            if answer_file_path:
                with open(f"{seed_root_dir}/{answer_file_path}", "r") as f:
                    testcase["answer_file_content"] = f.read()

        problems_info.append(ProblemJson(problem=problem, testcases=testcases, testcases_with_path=testcases_with_path))
    return problems_info

def insert_problem_info(seed_root_dir: str, json_file_name: str):
    db:Session = next(deps.get_db())
    print(type(db))

    problems_info = read_json(seed_root_dir, json_file_name)

    # for problem in problems
    for problem_info in problems_info:
        problems_info = problem_info.problem
        created_problem = crud.create_problem(db, problems_info)
        if not created_problem:
            raise Exception("Problem creation failed")

        for i in range(len(problem_info.testcases)):
            testcase_with_path = problem_info.testcases_with_path[i]
            testcase = problem_info.testcases[i]

            created_testcase_with_path = crud.create_testcase_with_path(db, testcase_with_path)
            if not created_testcase_with_path:
                raise Exception("TestcaseWithPath creation failed")
            testcase_id = created_testcase_with_path.testcase_id

            create_testcase = schemas.TestcaseCreate(
                testcase_id=testcase_id,
                problem_id=created_problem.problem_id,
                testcase_number=testcase.testcase_number,
                args_file_content=testcase.args_file_content,
                stdin_file_content=testcase.stdin_file_content,
                answer_file_content=testcase.answer_file_content
            )
            created_testcase = crud.create_testcase(db, create_testcase)
            if not created_testcase:
                raise Exception("Testcase creation failed")
