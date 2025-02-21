from typing import List
from sqlalchemy.orm import Session
from app import schemas, models

def create_testcase(db:Session, testcase: schemas.TestcaseCreate) -> models.Testcase:
    db_testcase = models.Testcase(**testcase.model_dump())
    db.add(db_testcase)
    db.commit()
    db.refresh(db_testcase)
    return db_testcase

def delete_all_testcases(db: Session) -> None:
    db.query(models.Testcase).delete()
    db.commit()
    return None
