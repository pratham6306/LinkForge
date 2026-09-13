from fastapi import FastAPI
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from database import get_db


app = FastAPI()


@app.get("/")
async def home():
    return {
        "message": "URL Shortener API is running"
    }


@app.get("/db-test")
async def database_test(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT 1"))

    return {
        "database": result.scalar()
    }