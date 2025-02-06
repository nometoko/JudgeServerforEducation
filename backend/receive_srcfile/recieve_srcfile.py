import os, sys, shutil
from fastapi import FastAPI, File, UploadFile
from typing import List

app = FastAPI()

sys.path.append(os.path.join(os.path.dirname(__file__), os.pardir))
from utils.get_root_dir import get_root_dir
ROOT_DIR = get_root_dir()

@app.post("/uploadfiles/")
async def upload_file(files: List[UploadFile], save_dir: str = os.path.join(ROOT_DIR, "compile_resource")) -> List[str]:
    for file in files:
        file_path: str = os.path.join(save_dir, file.filename)

        # copy file to save_dir
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

    return [f.filename for f in files]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
