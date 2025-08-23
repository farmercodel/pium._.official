# app/repository/ad_repo.py
from __future__ import annotations
from typing import List, Dict, Any
from sqlalchemy import select, delete, desc, insert, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ad import AdRequest, AdVariant, AdSelection

class AdRepo:
    @staticmethod
    async def save_request(
        session: AsyncSession,
        *,
        user_id: int,
        payload: Dict[str, Any],
    ) -> int:
        """유저 기준 요청 저장, 생성된 request.id 반환"""
        req = AdRequest(user_id=user_id, payload=payload)
        session.add(req)
        await session.flush()
        return req.id  # int PK 가정

    @staticmethod
    async def save_variants(
        session: AsyncSession,
        *,
        request_id: int,
        variants: List[Dict[str, Any]],
    ) -> None:
        """생성된 카피 후보들 저장"""
        for i, v in enumerate(variants or []):
            session.add(
                AdVariant(
                    id=v.get("id") or v.get("variant_id"),   # 문자열 PK면 그대로, 숫자면 모델에 맞게 조정
                    request_id=request_id,
                    index_no=i,
                    content=v.get("content") or v.get("text"),
                )
            )
        await session.flush()

    @staticmethod
    async def choose(
        session: AsyncSession,
        *,
        user_id: int,
        variant_id: str,
        content: str,
    ) -> None:
        """유저별 최종 선택 1행 유지(업서트)"""
        await session.execute(delete(AdSelection).where(AdSelection.user_id == user_id))
        session.add(AdSelection(user_id=user_id, variant_id=variant_id, content=content))
        await session.flush()

    @staticmethod
    async def get_choice(
        session: AsyncSession,
        *,
        user_id: int,
    ):
        res = await session.execute(select(AdSelection).where(AdSelection.user_id == user_id))
        return res.scalar_one_or_none()

    @staticmethod
    async def get_latest_request(
        session: AsyncSession,
        *,
        user_id: int,
    ):
        q = (
            select(AdRequest)
            .where(AdRequest.user_id == user_id)
            .order_by(desc(AdRequest.created_at))
            .limit(1)
        )
        res = await session.execute(q)
        return res.scalar_one_or_none()
    
    @staticmethod
    async def get_variant_by_id(session: AsyncSession, *, user_id: int, variant_id: str):
        """
        보안상 유저 소유의 variant만 조회 (AdVariant.request_id -> AdRequest.user_id 조인)
        """
        q = (
            select(AdVariant)
            .join(AdRequest, AdVariant.request_id == AdRequest.id)
            .where(AdRequest.user_id == user_id, AdVariant.id == variant_id)
            .order_by(desc(AdRequest.created_at))
            .limit(1)
        )
        res = await session.execute(q)
        return res.scalar_one_or_none()
    
    @staticmethod
    async def get_variant_for_user(db, user_id: int, variant_id: str, request_id: int | None = None):
        q = select(AdVariant).join(AdRequest, AdVariant.request_id == AdRequest.id) \
                            .where(AdRequest.user_id == user_id, AdVariant.id == variant_id)
        if request_id is not None:
            q = q.where(AdVariant.request_id == request_id)  # ✅ 최신 요청에 소속된 variant만
        res = await db.execute(q)
        return res.scalar_one_or_none()
    
    @staticmethod
    async def get_request(session: AsyncSession, *, request_id: int, user_id: int):
        q = (
            select(AdRequest)
            .where(AdRequest.id == request_id, AdRequest.user_id == user_id)
            .limit(1)
        )
        res = await session.execute(q)
        return res.scalar_one_or_none()
