# app/api/tosspayments.py
import os
import base64
from typing import Optional
from fastapi import APIRouter, HTTPException, Request, status, Query, Depends
from pydantic import BaseModel, Field
import httpx
from app.api.auth import get_current_user
from datetime import datetime, timedelta
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode

FRONT_BASE_URL = os.environ.get("FRONT_BASE_URL", "http://localhost:5173")

router = APIRouter(prefix="/payments/toss", tags=["payments:toss"])

# ===== 환경 변수 =====
TOSS_SECRET_KEY = os.environ.get("TOSS_SECRET_KEY", "")
BASE_URL = os.environ.get("BASE_URL", "http://localhost:8000")

if not TOSS_SECRET_KEY:
    print("[WARN] TOSS_SECRET_KEY 미설정")

_basic = base64.b64encode((TOSS_SECRET_KEY + ":").encode()).decode()
COMMON_HEADERS = {
    "Authorization": f"Basic {_basic}",
    "Content-Type": "application/json",
}


# 결제요청 시 서버가 계산/기록해둔 금액 검증용
ORDERS = {}  # order_id -> {"amount": int, "status": "READY|PAID|CANCELED", "paymentKey": Optional[str]}
BILLING = {}       # customerKey -> {"billingKey": str, "userId": Optional[int]}
SUBSCRIPTIONS = {} # customerKey -> {"plan": str, "amount": int, "interval": "MONTH", "nextBillingAt": str(ISO)}


class CreateOrderReq(BaseModel):
    order_id: str = Field(..., min_length=6, max_length=64)
    amount: int = Field(..., gt=0)
    order_name: str = Field(..., max_length=100)

class ConfirmReq(BaseModel):
    paymentKey: str
    orderId: str
    amount: int

class CancelReq(BaseModel):
    paymentKey: str
    cancelReason: str = Field(..., max_length=200)
    cancelAmount: Optional[int] = Field(None, gt=0)

class StartBillingReq(BaseModel):
    customer_key: str = Field(..., min_length=3, max_length=100)
    plan: str = Field(..., max_length=20)
    amount: int = Field(..., gt=0)

# ===== API =====
@router.post("/orders", status_code=status.HTTP_201_CREATED)
def create_order(
    req: CreateOrderReq,
    current_user = Depends(get_current_user),
):
    
    ORDERS[req.order_id] = {
        "amount": req.amount,
        "status": "READY",
        "paymentKey": None,
        "orderName": req.order_name,
        "userId": getattr(current_user, "id", None),
    }
    success_url = f"{BASE_URL}/api/payments/toss/success"
    fail_url = f"{BASE_URL}/api/payments/toss/fail"
    return {
        "ok": True,
        "orderId": req.order_id,
        "amount": req.amount,
        "orderName": req.order_name,
        "successUrl": success_url,
        "failUrl": fail_url,
    }

@router.get("/success")
async def toss_success(
    paymentKey: str = Query(...),
    orderId: str = Query(...),
    amount: int = Query(...)
):
    order = ORDERS.get(orderId)
    if not order:
        raise HTTPException(status_code=404, detail="Unknown orderId")
    if order["status"] != "READY":
        return {"ok": True, "orderId": orderId, "status": order["status"]}

    if order["amount"] != amount:
        raise HTTPException(status_code=400, detail="Amount mismatch")

    confirm_payload = {"paymentKey": paymentKey, "orderId": orderId, "amount": amount}
    headers = {**COMMON_HEADERS, "Idempotency-Key": f"{orderId}:{paymentKey}"}

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(
            "https://api.tosspayments.com/v1/payments/confirm",
            headers=headers,
            json=confirm_payload
        )
    if r.status_code != 200:
        raise HTTPException(status_code=400, detail=r.text)

    data = r.json()
    order["status"] = "PAID"
    order["paymentKey"] = paymentKey
    return {
        "ok": True,
        "orderId": orderId,
        "status": order["status"],
        "method": data.get("method"),
        "approvedAt": data.get("approvedAt")
    }

@router.post("/cancel")
async def toss_cancel(
    req: CancelReq,
    current_user = Depends(get_current_user),
):
    
    target_order_id = None
    for oid, od in ORDERS.items():
        if od.get("paymentKey") == req.paymentKey:
            target_order_id = oid
            # 사용자 불일치면 취소 금지
            if od.get("userId") and od["userId"] != getattr(current_user, "id", None):
                raise HTTPException(status_code=403, detail="Not your payment")
            break
    if not target_order_id:
        raise HTTPException(status_code=404, detail="Payment not found")

    url = f"https://api.tosspayments.com/v1/payments/{req.paymentKey}/cancel"
    payload = {"cancelReason": req.cancelReason}
    if req.cancelAmount is not None:
        payload["cancelAmount"] = req.cancelAmount

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(url, headers=COMMON_HEADERS, json=payload)
    if r.status_code != 200:
        raise HTTPException(status_code=400, detail=r.text)

    data = r.json()
    ORDERS[target_order_id]["status"] = "CANCELED"
    return {"ok": True, "cancels": data.get("cancels")}

@router.post("/webhook")
async def toss_webhook(request: Request):
    body = await request.json()
    return {"received": True}

@router.post("/billing/start")
def billing_start(req: StartBillingReq, current_user = Depends(get_current_user)):
    success_url = f"{BASE_URL}/api/payments/toss/billing/auth-success"
    fail_url    = f"{BASE_URL}/api/payments/toss/billing/auth-fail"

    SUBSCRIPTIONS[req.customer_key] = {
        "plan": req.plan,
        "amount": req.amount,
        "interval": "MONTH",
        "nextBillingAt": None,
        "userId": getattr(current_user, "id", None),
    }
    return {"ok": True, "successUrl": success_url, "failUrl": fail_url}

@router.get("/billing/auth-success")
async def billing_auth_success(authKey: str = Query(...), customerKey: str = Query(...), orderId: Optional[str] = Query(None)):
    issue_url = "https://api.tosspayments.com/v1/billing/authorizations/issue"
    payload = {"authKey": authKey, "customerKey": customerKey}
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(issue_url, headers=COMMON_HEADERS, json=payload)
    if r.status_code != 200:
        raise HTTPException(status_code=400, detail=r.text)
    billingKey = r.json().get("billingKey")
    if not billingKey:
        raise HTTPException(status_code=500, detail="billingKey missing")

    # 서버에 billingKey 저장
    # (userId는 미리 SUBSCRIPTIONS에 저장해둔 값 사용)
    BILLING[customerKey] = {
        "billingKey": billingKey,
        "userId": SUBSCRIPTIONS.get(customerKey, {}).get("userId"),
    }

    # 다음 결제일(바로 내달 오늘) 설정
    sub = SUBSCRIPTIONS.get(customerKey, None)
    if not sub:
        # 없으면 최소 정보 생성
        SUBSCRIPTIONS[customerKey] = {"plan": "UNKNOWN", "amount": 0, "interval": "MONTH", "userId": None}
        sub = SUBSCRIPTIONS[customerKey]
    next_dt = (datetime.now() + timedelta(days=30)).isoformat()  # 단순화(운영: 말일 보정 로직 권장)
    sub["nextBillingAt"] = next_dt

    # 프런트로 리다이렉트 (메인으로)
    q = urlencode({"billing_enrolled": "1", "customerKey": customerKey})
    return RedirectResponse(f"{FRONT_BASE_URL}/plans?{q}", status_code=303)

@router.get("/billing/auth-fail")
async def billing_auth_fail(errorCode: str | None = None, errorMessage: str | None = None, orderId: str | None = None):
    q = urlencode({"billing_enrolled": "0", "error": errorCode or "", "msg": errorMessage or ""})
    return RedirectResponse(f"{FRONT_BASE_URL}/plans?{q}", status_code=303)

class ChargeNowReq(BaseModel):
    customer_key: str
    amount: Optional[int] = Field(None, gt=0)  # None이면 구독 금액 사용
    order_id: Optional[str] = None

@router.post("/billing/charge-now")
async def billing_charge_now(req: ChargeNowReq):
    """
    2) (테스트용) 즉시 청구 API — 스케줄러 없이 수동으로 청구해보기
    """
    info = BILLING.get(req.customer_key)
    if not info:
        raise HTTPException(status_code=404, detail="No billingKey for customerKey")
    billingKey = info["billingKey"]

    sub = SUBSCRIPTIONS.get(req.customer_key)
    if not sub:
        raise HTTPException(status_code=404, detail="No subscription for customerKey")
    amount = req.amount or sub["amount"]
    order_id = req.order_id or f"SUBS_{req.customer_key}_{int(datetime.now().timestamp())}"

    url = f"https://api.tosspayments.com/v1/billing/{billingKey}"
    payload = {
        "amount": amount,
        "orderId": order_id,
        "customerKey": req.customer_key,
        "orderName": f"{sub['plan']} subscription monthly",
    }
    headers = {**COMMON_HEADERS, "Idempotency-Key": f"{order_id}:{billingKey}"}

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(url, headers=headers, json=payload)
    if r.status_code != 200:
        raise HTTPException(status_code=400, detail=r.text)

    # 다음 결제일 갱신(단순 30일 가산)
    sub["nextBillingAt"] = (datetime.now() + timedelta(days=30)).isoformat()
    return {"ok": True, "payment": r.json(), "nextBillingAt": sub["nextBillingAt"]}