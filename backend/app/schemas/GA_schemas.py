# backend/app/schemas/GA_schemas.py
from __future__ import annotations
from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional, Literal
from datetime import time

class BusinessHours(BaseModel):
    open: time
    close: time

ToneEnum = Literal["Casual","professional","Witty","emotional","urgent","luxury"]

class GenerateAdRequest(BaseModel):
    session_id: Optional[str] = None
    store_name: str
    area_keywords: List[str]
    address: str
    price: str
    business_hours: BusinessHours
    category: str
    store_intro: str

    tone: Optional[ToneEnum] = "Casual"
    reference_links: Optional[List[HttpUrl]] = None
    product_service_keywords: Optional[List[str]] = None
    target_customers: Optional[List[str]] = None
    instagram_id: Optional[str] = None
    promotions: Optional[List[str]] = None
    image_urls: Optional[List[HttpUrl]] = None
    hashtag_limit: int = Field(default=15, ge=1, le=30)

    num_variants: int = Field(default=3, ge=1, le=5)
    avoid_texts: Optional[List[str]] = None
