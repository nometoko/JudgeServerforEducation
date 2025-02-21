import json
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List


from app import schemas, crud
from app.api import deps

class ProblemJson(BaseModel):
    problem: schemas.ProblemCreate
    testcases: List[schemas.TestcaseCreate]

def read_json(json_file_path: str) -> List[ProblemJson]:
    with open(json_file_path, "r") as f:
        problems = json.load(f)

    problems_info = []
    for problem in problems:
        testcases = problem.pop("testcase_with_paths")
        testcases['problem_id'] = problem['problem_id']
        problems_info.append(ProblemJson(problem=problem, testcases=testcases))
    return problems_info

def initialize_problem_info(json_file_path: str) -> None:
    db:Session = next(deps.get_db())
    print(type(db))
    crud.delete_all_problems(db)


    # problems_info = read_json(json_file_path)

    # # for problem in problems
    # for problem_info in problems_info:
    #     problems_info = problem_info.problem
    #     created_problem = crud.create_problem(db, problems_info)
    #     if not created_problem:
    #         raise Exception("Problem creation failed")
    #     testcases_info = problem_info.testcases
    #     for testcase_info in testcases_info:
    #         created_testcase = crud.create_testcase(db, testcase_info)
    #         if not created_testcase:
    #             raise Exception("Testcase creation failed")
