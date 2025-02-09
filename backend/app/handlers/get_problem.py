import os
from fastapi import FastAPI, HTTPException
### 別ファイルをimportするための記述。@routerにすることに注意 
from fastapi import APIRouter

router = APIRouter()
###

@router.get("/getProblemList")
async def get_problem_handler():
    print("getProblemList")
    
	#    try:
    #    testcase_data = problems_crud.read_testcase_content(problem)
    #except Exception as e:
    #    raise HTTPException(status_code=500, detail=f"Failed to read testcase file: {str(e)}")

    return {"problems": [], "message": "Success"}