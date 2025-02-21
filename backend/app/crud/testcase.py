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

def delete_all_testcases_with_path(db: Session) -> None:
    db.query(models.TestcaseWithPath).delete()
    db.commit()
    return None

def delete_all_testcases(db: Session) -> None:
    db.query(models.Testcase).delete()
    db.commit()
    return None
