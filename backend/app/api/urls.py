from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.url import URLCreate, URLResponse
from app.services.url_service import url_service

router = APIRouter()


@router.post("/api/v1/urls", response_model=URLResponse)
async def create_short_url(
    data: URLCreate,
    db: AsyncSession = Depends(get_db),
):
    return await url_service.create_short_url(db, data)


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
