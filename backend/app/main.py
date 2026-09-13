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

# Configure CORS Middleware for Frontend Access
cors_origins_raw = os.getenv("CORS_ORIGINS", "")
default_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://linkforge-frontend.onrender.com",
    "https://linkforge-app.onrender.com",
]

if cors_origins_raw:
    custom_origins = [o.strip() for o in cors_origins_raw.split(",") if o.strip()]
    origins = list(set(default_origins + custom_origins))
else:
    origins = default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
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
