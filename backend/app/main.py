import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.urls import router as urls_router
from app.api.auth import router as auth_router

app = FastAPI(
    title="LinkForge API",
    description="A high-performance URL shortening and link analytics service built with FastAPI and PostgreSQL",
    version="1.0.0",
)

# Configure CORS Middleware for Frontend & External Access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(urls_router)


@app.get("/")
async def home():
    return {
        "message": "LinkForge API is running"
    }
