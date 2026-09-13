import secrets
import string
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.repositories.url_repository import url_repository
from app.schemas.url import URLCreate, URLResponse
from app.models.url import URL


class URLService:
    def generate_short_code(self, length: int = 6) -> str:
        """Generate a random alphanumeric short code."""
        characters = string.ascii_letters + string.digits
        return "".join(secrets.choice(characters) for _ in range(length))

    async def create_short_url(
        self,
        db: AsyncSession,
        data: URLCreate,
        base_url: str = "http://127.0.0.1:8000",
    ) -> URLResponse:
        # Generate a unique short code
        while True:
            short_code = self.generate_short_code()
            existing_url = await url_repository.get_by_short_code(db, short_code)
            if existing_url is None:
                break

        url_record = await url_repository.create(
            db=db,
            original_url=str(data.original_url),
            short_code=short_code,
        )

        return URLResponse(
            id=url_record.id,
            original_url=url_record.original_url,
            short_code=url_record.short_code,
            short_url=f"{base_url}/{url_record.short_code}",
        )

    async def get_original_url(self, db: AsyncSession, short_code: str) -> URL:
        url_record = await url_repository.get_by_short_code(db, short_code)
        if url_record is None:
            raise HTTPException(
                status_code=404,
                detail="Short URL not found",
            )

        await url_repository.increment_click_count(db, url_record)
        return url_record


url_service = URLService()
