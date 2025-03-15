from typing import List
from sqlalchemy.orm import Session
from app import schemas, models

def create_testcase(db:Session, testcase: schemas.TestcaseCreate) -> models.Testcase:
    db_testcase = models.Testcase(**testcase.model_dump())
    db.add(db_testcase)
    db.commit()
    db.refresh(db_testcase)
    return db_testcase

def create_testcase_with_path(db:Session, testcase_with_path: schemas.TestcaseWithPathCreate) -> models.TestcaseWithPath:
    db_testcase_with_path = models.TestcaseWithPath(**testcase_with_path.model_dump())
    db.add(db_testcase_with_path)
    db.commit()
    db.refresh(db_testcase_with_path)
    return db_testcase_with_path

def get_testcases_with_path_by_problem_id(db: Session, problem_id: int) -> List[models.TestcaseWithPath]:
    return db.query(models.TestcaseWithPath).filter(models.TestcaseWithPath.problem_id == problem_id).all()

def get_testcase_by_id(db: Session, problem_id: int, testcase_number: int) -> models.Testcase | None:
    return db.query(models.Testcase).filter(models.Testcase.problem_id == problem_id, models.Testcase.testcase_number == testcase_number).first()

def delete_all_testcases_with_path(db: Session) -> None:
    db.query(models.TestcaseWithPath).delete()
    db.commit()
    return None

def delete_testcases_with_path_by_problem_id(db: Session, problem_id: int) -> None:
    db.query(models.TestcaseWithPath).filter(models.TestcaseWithPath.problem_id == problem_id).delete()
    db.commit()
    return None

def delete_all_testcases(db: Session) -> None:
    db.query(models.Testcase).delete()
    db.commit()
    return None

def delete_testcases_by_problem_id(db: Session, problem_id: int) -> None:
    db.query(models.Testcase).filter(models.Testcase.problem_id == problem_id).delete()
    db.commit()
    return None
