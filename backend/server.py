from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import copy
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime, timezone

import mock_data

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="8x Worker API")
api_router = APIRouter(prefix="/api")

logger = logging.getLogger("8x")
logging.basicConfig(level=logging.INFO)


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class TextAnswer(BaseModel):
    questionId: str
    answer: str


class SubmissionCreate(BaseModel):
    missionId: str
    type: Literal["text", "voice"]
    answers: Optional[List[TextAnswer]] = None
    durationSeconds: Optional[int] = None
    recorded: Optional[bool] = False
    consent: Optional[bool] = False


class SubmissionResult(BaseModel):
    ok: bool
    submissionId: str
    message: str


# ---------------------------------------------------------------------------
# Profile state (stored so it can "evolve" as missions are completed)
# ---------------------------------------------------------------------------

async def get_profile_state() -> dict:
    """Return the current profile, seeding from BASE_PROFILE on first read."""
    doc = await db.profile_state.find_one({"_id": "default"})
    if doc is None:
        seed = copy.deepcopy(mock_data.BASE_PROFILE)
        await db.profile_state.insert_one({"_id": "default", **seed})
        return seed
    doc.pop("_id", None)
    return doc


async def evolve_profile() -> None:
    """Nudge the observed capabilities after a completed submission.

    Process contribution grows a little faster than Outcome, and Process
    always stays the larger share — this is what the app visualises.
    """
    profile = await get_profile_state()
    for dim in profile["dimensions"]:
        dim["process"] = min(dim["process"] + 3, 88)
        dim["outcome"] = min(dim["outcome"] + 1, dim["process"] - 4)
    profile["observedMissions"] = profile.get("observedMissions", 3) + 1
    await db.profile_state.update_one(
        {"_id": "default"}, {"$set": profile}, upsert=True
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@api_router.get("/")
async def root():
    return {"message": "8x Worker API is running"}


@api_router.get("/missions")
async def list_missions():
    """Missions for the inbox (summary fields only)."""
    fields = (
        "id", "company", "companyLogo", "title", "purpose", "action",
        "durationLabel", "durationMinutes", "type", "status", "isExtra", "urgency",
    )
    return [{k: m.get(k) for k in fields} for m in mock_data.MISSIONS]


@api_router.get("/missions/{mission_id}")
async def get_mission(mission_id: str):
    mission = mock_data.find_mission(mission_id)
    if mission is None:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission


@api_router.get("/profile")
async def get_profile():
    return await get_profile_state()


@api_router.get("/history")
async def get_history():
    return mock_data.HISTORY


@api_router.post("/submissions", response_model=SubmissionResult)
async def create_submission(payload: SubmissionCreate):
    mission = mock_data.find_mission(payload.missionId)
    if mission is None:
        raise HTTPException(status_code=404, detail="Mission not found")

    submission_id = str(uuid.uuid4())
    record = {
        "id": submission_id,
        "missionId": payload.missionId,
        "type": payload.type,
        "answers": [a.model_dump() for a in payload.answers] if payload.answers else [],
        "durationSeconds": payload.durationSeconds,
        "recorded": bool(payload.recorded),
        "consent": bool(payload.consent),
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    await db.submissions.insert_one(record)

    # The orchestrator evaluates the work; here we simply let the observed
    # profile grow so the user can see it evolve.
    await evolve_profile()

    return SubmissionResult(
        ok=True,
        submissionId=submission_id,
        message="Got it — thank you.",
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
