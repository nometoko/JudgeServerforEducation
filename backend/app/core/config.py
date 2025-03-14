import enum
from typing import Any, Optional
from urllib.parse import quote_plus

from pydantic import PostgresDsn, ValidationInfo, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppEnvironment(str, enum.Enum):
    DEVELOP = "development"
    PRODUCTION = "production"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    ENVIRONMENT: AppEnvironment

    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "JSE"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    ENVIRONMENT: AppEnvironment

    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "JSE"

    # POSTGRES_SERVER: str
    # POSTGRES_USER: str
    # POSTGRES_PASSWORD: str
    # POSTGRES_DB: str
    # POSTGRES_PORT: str
    # SQLALCHEMY_DATABASE_URI: Optional[str] = None
    #
    # @field_validator("SQLALCHEMY_DATABASE_URI", mode="after")
    # def assemble_db_connection(cls, v: Optional[str], values: ValidationInfo) -> Any:
    #     if isinstance(v, str):
    #         return v
    #
    #     return str(
    #         PostgresDsn.build(
    #             scheme="postgresql",
    #             username=values.data.get("POSTGRES_USER"),
    #             password=quote_plus(values.data.get("POSTGRES_PASSWORD")),
    #             host=values.data.get("POSTGRES_SERVER"),
    #             port=int(values.data.get("POSTGRES_PORT")),
    #             path=f"{values.data.get('POSTGRES_DB') or ''}",
    #         )
    #     )


settings = Settings()
