from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.url import URLCreate, URLResponse
from app.services.url_service import url_service
from app.api.auth import get_current_user
from app.models import User

router = APIRouter()


@router.post("/api/v1/urls", response_model=URLResponse)
async def create_short_url(
    data: URLCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await url_service.create_short_url(db, data, user_id=current_user.id)


@router.get("/api/v1/urls/my-urls", response_model=list[URLResponse])
async def get_my_urls(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await url_service.get_user_url_history(db, user_id=current_user.id)


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
