from datetime import datetime
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.url import URL


class URLRepository:
    async def get_by_short_code(self, db: AsyncSession, short_code: str) -> URL | None:
        query = select(URL).where(URL.short_code == short_code)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_user_id(self, db: AsyncSession, user_id: int) -> list[URL]:
        query = select(URL).where(URL.user_id == user_id).order_by(URL.created_at.desc())
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_next_id(self, db: AsyncSession) -> int:
        """Fetches the next unique integer ID using the PostgreSQL sequence or max ID fallback."""
        try:
            result = await db.execute(text("SELECT nextval('urls_id_seq')"))
            return result.scalar_one()
        except Exception:
            query = select(URL.id).order_by(URL.id.desc()).limit(1)
            result = await db.execute(query)
            max_id = result.scalar_one_or_none()
            return (max_id or 0) + 1

    async def create(
        self,
        db: AsyncSession,
        original_url: str,
        short_code: str,
        user_id: int | None = None,
        custom_id: int | None = None,
        expires_at: datetime | None = None,
    ) -> URL:
        url = URL(
            id=custom_id,
            user_id=user_id,
            original_url=original_url,
            short_code=short_code,
            expires_at=expires_at,
        )
        db.add(url)
        await db.commit()
        await db.refresh(url)
        return url

    async def increment_click_count(self, db: AsyncSession, url_record: URL) -> URL:
        url_record.click_count += 1
        await db.commit()
        return url_record


url_repository = URLRepository()
