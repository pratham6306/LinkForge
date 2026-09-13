from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.url import URL


class URLRepository:
    async def get_by_short_code(self, db: AsyncSession, short_code: str) -> URL | None:
        query = select(URL).where(URL.short_code == short_code)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, original_url: str, short_code: str) -> URL:
        url = URL(
            original_url=original_url,
            short_code=short_code,
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
