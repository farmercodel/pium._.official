from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ad import AdRequest, AdVariant, AdSelection

class AdRepo:
    @staticmethod
    async def save_request(session: AsyncSession, session_id: str, payload: dict) -> str:
        req = AdRequest(session_id=session_id, payload=payload)
        session.add(req)
        await session.flush()
        return req.id

    @staticmethod
    async def save_variants(session: AsyncSession, request_id: str, variants: list[dict]):
        for i, v in enumerate(variants):
            session.add(AdVariant(id=v["id"], request_id=request_id, index_no=i, content=v["content"]))
        await session.flush()

    @staticmethod
    async def choose(session: AsyncSession, session_id: str, variant_id: str, content: str):
        # 같은 세션이면 덮어쓰기
        await session.execute(delete(AdSelection).where(AdSelection.session_id == session_id))
        sel = AdSelection(session_id=session_id, variant_id=variant_id, content=content)
        session.add(sel)
        await session.flush()

    @staticmethod
    async def get_choice(session: AsyncSession, session_id: str):
        res = await session.execute(select(AdSelection).where(AdSelection.session_id == session_id))
        return res.scalar_one_or_none()
