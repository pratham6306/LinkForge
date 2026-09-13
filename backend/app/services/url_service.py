import os
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.repositories.url_repository import url_repository
from app.schemas.url import URLCreate, URLResponse
from app.models.url import URL
from app.utils.base62 import generate_short_code_from_id


class URLService:
    async def create_short_url(
        self,
        db: AsyncSession,
        data: URLCreate,
        user_id: int | None = None,
        base_url: str | None = None,
    ) -> URLResponse:
        target_base_url = base_url or os.getenv("BASE_URL", "http://localhost:8000")

        # Fetch next unique database sequence ID
        next_id = await url_repository.get_next_id(db)

        # Generate unique Base62 short code from the ID
        short_code = generate_short_code_from_id(next_id)

        # Save record atomically linked to user_id
        url_record = await url_repository.create(
            db=db,
            original_url=str(data.original_url),
            short_code=short_code,
            user_id=user_id,
            custom_id=next_id,
            expires_at=data.expires_at,
        )

        return URLResponse(
            id=url_record.id,
            user_id=url_record.user_id,
            original_url=url_record.original_url,
            short_code=url_record.short_code,
            short_url=f"{target_base_url}/{url_record.short_code}",
            click_count=url_record.click_count,
            created_at=url_record.created_at,
            expires_at=url_record.expires_at,
        )

    async def get_user_url_history(
        self,
        db: AsyncSession,
        user_id: int,
        base_url: str | None = None,
    ) -> list[URLResponse]:
        target_base_url = base_url or os.getenv("BASE_URL", "http://localhost:8000")
        urls = await url_repository.get_by_user_id(db, user_id)
        return [
            URLResponse(
                id=u.id,
                user_id=u.user_id,
                original_url=u.original_url,
                short_code=u.short_code,
                short_url=f"{target_base_url}/{u.short_code}",
                click_count=u.click_count,
                created_at=u.created_at,
                expires_at=u.expires_at,
            )
            for u in urls
        ]

    async def get_original_url(self, db: AsyncSession, short_code: str) -> URL:
        url_record = await url_repository.get_by_short_code(db, short_code)
        if url_record is None:
            raise HTTPException(
                status_code=404,
                detail="Short URL not found",
            )

        # Check if URL has expired
        if url_record.expires_at is not None:
            now = datetime.now(timezone.utc)
            expires_at = url_record.expires_at
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)

            if now > expires_at:
                raise HTTPException(
                    status_code=410,
                    detail="Short URL has expired",
                )

        await url_repository.increment_click_count(db, url_record)
        return url_record


url_service = URLService()
