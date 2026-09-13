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
        base_url: str = "http://127.0.0.1:8000",
    ) -> URLResponse:
        # Fetch next unique database sequence ID
        next_id = await url_repository.get_next_id(db)

        # Generate unique Base62 short code from the ID
        short_code = generate_short_code_from_id(next_id)

        # Save record atomically with optional expiration timestamp
        url_record = await url_repository.create(
            db=db,
            original_url=str(data.original_url),
            short_code=short_code,
            custom_id=next_id,
            expires_at=data.expires_at,
        )

        return URLResponse(
            id=url_record.id,
            original_url=url_record.original_url,
            short_code=url_record.short_code,
            short_url=f"{base_url}/{url_record.short_code}",
            created_at=url_record.created_at,
            expires_at=url_record.expires_at,
        )

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
