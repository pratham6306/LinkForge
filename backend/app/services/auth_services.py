import os
from datetime import datetime, timedelta, timezone
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from pwdlib import PasswordHash

from app.models import User
from app.repositories.user_repository import UserRepository

SECRET_KEY = os.getenv("SECRET_KEY", "secret-key-for-jwt-authentication-url-shortener")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

password_hash = PasswordHash.recommended()


class AuthService:
    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    async def register_user(
        db: AsyncSession,
        email: str,
        password: str,
    ) -> User:
        existing_user = await UserRepository.get_by_email(db, email)
        if existing_user is not None:
            raise ValueError("Email already registered")

        hashed_password = password_hash.hash(password)
        return await UserRepository.create(
            db=db,
            email=email,
            password_hash=hashed_password,
        )

    @staticmethod
    async def authenticate_user(
        db: AsyncSession,
        email: str,
        password: str,
    ) -> User | None:
        user = await UserRepository.get_by_email(db, email)
        if not user:
            return None
        if not password_hash.verify(password, user.password_hash):
            return None
        return user