from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User


class UserRepository:

    @staticmethod
    async def get_by_email(
        db: AsyncSession,
        email: str,
    ) -> User | None:

        query = select(User).where(
            User.email == email
        )

        result = await db.execute(query)

        return result.scalar_one_or_none()

    @staticmethod
    async def create(
        db: AsyncSession,
        email: str,
        password_hash: str,
    ) -> User:

        user = User(
            email=email,
            password_hash=password_hash,
        )

        db.add(user)

        await db.commit()
        await db.refresh(user)

        return user