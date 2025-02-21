from sqlalchemy.orm import Session

from app import models, schemas

def create_problem(db: Session, problem: schemas.ProblemCreate) -> models.Problem:
    db_problem = models.Problem(**problem.model_dump())
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    return db_problem

def delete_all_problems(db: Session) -> None:
    print(type(models.Problem))
    db.query(models.Problem).delete()
    db.commit()
    return None
