import os, sys, shutil
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import pydantic

app = FastAPI()

origins = [
	f"http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
	allow_credentials=True, # Cookieを使う場合はTrue
	allow_methods=["*"], # 全てのHTTPメソッド (GETとか)を許可
	allow_headers=["*"] # 全てのHTTPヘッダを許可、わかってないです
	#allow_headers=["Content-Type", "Authorization"],  # 必要なヘッダーのみ許可、他が必要かは検証
)

sys.path.append(os.path.join(os.path.dirname(__file__), os.pardir))
from utils.get_root_dir import get_root_dir
ROOT_DIR = get_root_dir()

@app.post("/uploadfiles/")
async def upload_file(files: List[UploadFile], save_dir: str = os.path.join(ROOT_DIR, "compile_resource")) -> List[str]:

    for file in files:
        if file.filename == "":
            continue
        file_path: str = os.path.join(save_dir, file.filename)

        # copy file to save_dir
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

    return [f.filename for f in files]

class FileListResponse(pydantic.BaseModel):
    filename: str
    content: str

@app.get("/getfilelist", response_model=List[FileListResponse])
async def get_file_list(dir_path: str = os.path.join(ROOT_DIR, "compile_resource")) -> List[FileListResponse]:
    files = [filename for filename in os.listdir(dir_path) if not filename.startswith('.') and filename != "Makefile"]
    print(files)
    submitted_files = []
    for file in files:
        with open(os.path.join(dir_path, file), "r") as f:
            content = f.read()
            submitted_files.append(FileListResponse(filename=file, content=content.strip()))
    return submitted_files

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
