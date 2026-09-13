from fastapi import FastAPI

from app.api.urls import router as urls_router

app = FastAPI(
    title="URL Shortener API",
    description="A URL shortening service built with FastAPI and PostgreSQL",
    version="1.0.0",
)

app.include_router(urls_router)


@app.get("/")
async def home():
    return {
        "message": "URL Shortener API is running"
    }
