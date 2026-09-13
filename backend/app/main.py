import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.urls import router as urls_router
from app.api.auth import router as auth_router

app = FastAPI(
    title="URL Shortener API",
    description="A URL shortening service built with FastAPI and PostgreSQL",
    version="1.0.0",
)

# Configure CORS Middleware for Frontend Access
cors_origins_raw = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173")
origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(urls_router)


@app.get("/")
async def home():
    return {
        "message": "URL Shortener API is running"
    }
