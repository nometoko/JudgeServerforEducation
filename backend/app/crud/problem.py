from sqlalchemy.orm import Session

from app import models, schemas

# post
def create_problem(db: Session, problem: schemas.ProblemCreate) -> models.Problem:
    db_problem = models.Problem(**problem.model_dump())
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    return db_problem

# get
def get_all_problems(db: Session) -> list[models.Problem]:
    return db.query(models.Problem).all()

def get_problem_by_id(db: Session, problem_id: int) -> models.Problem | None:
    return db.query(models.Problem).filter(models.Problem.problem_id == problem_id).first()

# delete
def delete_all_problems(db: Session) -> None:
    print(type(models.Problem))
    db.query(models.Problem).delete()
    db.commit()
    return None

def delete_problem_by_id(db: Session, problem_id: int) -> None:
    db.query(models.Problem).filter(models.Problem.problem_id == problem_id).delete()
    db.commit()
    return None
