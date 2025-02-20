from sqlalchemy import text
from app.db.session import engine
import dotenv

# 環境変数を読み込む
dotenv.load_dotenv("../.env")

with engine.connect() as connection:
    result = connection.execute(text("SELECT 'Hello, World!'"))
    print(result.scalar())
