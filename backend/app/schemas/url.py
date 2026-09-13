from datetime import datetime
from pydantic import BaseModel, HttpUrl


class URLCreate(BaseModel):
    original_url: HttpUrl
    expires_at: datetime | None = None


class URLResponse(BaseModel):
    id: int
    user_id: int | None = None
    original_url: str
    short_code: str
    short_url: str
    click_count: int = 0
    created_at: datetime
    expires_at: datetime | None = None

    class Config:
        from_attributes = True
