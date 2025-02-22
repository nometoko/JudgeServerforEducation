from app import crud
from app.api import deps

def delete_all_db_data():
    db = next(deps.get_db())

    crud.delete_all_submission_results(db)
    crud.delete_all_submissions(db)
    crud.delete_all_testcases(db)
    crud.delete_all_testcases_with_path(db)
    crud.delete_all_problems(db)
    crud.delete_all_users(db)
