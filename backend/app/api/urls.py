import os
from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.url import URLCreate, URLResponse
from app.services.url_service import url_service
from app.api.auth import get_current_user
from app.models import User

router = APIRouter()


def get_request_base_url(request: Request) -> str:
    configured = os.getenv("BASE_URL")
    if configured and configured.strip() and configured != "http://localhost:8000":
        return configured.rstrip("/")

    host = request.headers.get("x-forwarded-host") or request.headers.get("host")
    proto = request.headers.get("x-forwarded-proto") or request.url.scheme or "https"

    if host:
        return f"{proto}://{host}".rstrip("/")

    return "http://localhost:8000"


@router.post("/api/v1/urls", response_model=URLResponse)
async def create_short_url(
    data: URLCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    base_url = get_request_base_url(request)
    return await url_service.create_short_url(db, data, user_id=current_user.id, base_url=base_url)


@router.get("/api/v1/urls/my-urls", response_model=list[URLResponse])
async def get_my_urls(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    base_url = get_request_base_url(request)
    return await url_service.get_user_url_history(db, user_id=current_user.id, base_url=base_url)


@router.get("/{short_code}")
async def redirect_to_original(
    short_code: str,
    db: AsyncSession = Depends(get_db),
):
    url_record = await url_service.get_original_url(db, short_code)
    return RedirectResponse(
        url=url_record.original_url,
        status_code=307,
    )
