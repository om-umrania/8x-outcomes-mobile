"""Backend API tests for 8x Worker app."""
import os
import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL")
if not BASE_URL:
    # Read from frontend/.env directly as fallback
    env_path = "/app/frontend/.env"
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().strip('"')
                    break

BASE_URL = (BASE_URL or "").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Missions ---
class TestMissions:
    def test_list_missions_returns_three(self, api_client):
        r = api_client.get(f"{API}/missions", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 3
        ids = {m["id"] for m in data}
        assert ids == {"m_chef_voice", "m_extra_text", "m_prep_text"}

    def test_list_missions_types_and_extra_flag(self, api_client):
        r = api_client.get(f"{API}/missions", timeout=10)
        data = {m["id"]: m for m in r.json()}
        assert data["m_chef_voice"]["type"] == "voice"
        assert data["m_extra_text"]["type"] == "text"
        assert data["m_extra_text"]["isExtra"] is True
        assert data["m_prep_text"]["type"] == "text"
        assert data["m_prep_text"]["isExtra"] is False

    def test_get_mission_voice_full_detail(self, api_client):
        r = api_client.get(f"{API}/missions/m_chef_voice", timeout=10)
        assert r.status_code == 200
        m = r.json()
        assert m["id"] == "m_chef_voice"
        assert m["type"] == "voice"
        assert m["scenario"] and "dosa" in m["scenario"].lower()
        assert m["requiresConsent"] is True
        assert m["voice"] is not None
        assert "consentTitle" in m["voice"]

    def test_get_mission_text_has_questions(self, api_client):
        r = api_client.get(f"{API}/missions/m_extra_text", timeout=10)
        assert r.status_code == 200
        m = r.json()
        assert len(m["questions"]) == 2
        assert m["questions"][0]["id"] == "q1"

    def test_get_mission_404(self, api_client):
        r = api_client.get(f"{API}/missions/does_not_exist", timeout=10)
        assert r.status_code == 404


# --- Profile ---
class TestProfile:
    def test_profile_five_dimensions_process_gt_outcome(self, api_client):
        r = api_client.get(f"{API}/profile", timeout=10)
        assert r.status_code == 200
        p = r.json()
        assert len(p["dimensions"]) == 5
        for d in p["dimensions"]:
            assert d["process"] > d["outcome"], f"{d['key']}: process must exceed outcome"
        assert "observedMissions" in p
        assert isinstance(p["observedMissions"], int)

    def test_profile_no_mongo_id(self, api_client):
        p = api_client.get(f"{API}/profile", timeout=10).json()
        assert "_id" not in p


# --- History ---
class TestHistory:
    def test_history_three_items(self, api_client):
        r = api_client.get(f"{API}/history", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 3
        for item in data:
            assert {"id", "title", "company", "type", "summary"}.issubset(item.keys())


# --- Submissions ---
class TestSubmissions:
    def test_text_submission_returns_ok_and_evolves_profile(self, api_client):
        before = api_client.get(f"{API}/profile", timeout=10).json()
        obs_before = before["observedMissions"]

        payload = {
            "missionId": "m_extra_text",
            "type": "text",
            "answers": [
                {"questionId": "q1", "answer": "TEST_first move"},
                {"questionId": "q2", "answer": "TEST_keep quality"},
            ],
        }
        r = api_client.post(f"{API}/submissions", json=payload, timeout=10)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["ok"] is True
        assert body["message"] == "Got it — thank you."
        assert body["submissionId"]

        after = api_client.get(f"{API}/profile", timeout=10).json()
        assert after["observedMissions"] == obs_before + 1

    def test_voice_submission_returns_ok_and_evolves(self, api_client):
        before = api_client.get(f"{API}/profile", timeout=10).json()
        obs_before = before["observedMissions"]

        payload = {
            "missionId": "m_chef_voice",
            "type": "voice",
            "durationSeconds": 42,
            "recorded": True,
            "consent": True,
        }
        r = api_client.post(f"{API}/submissions", json=payload, timeout=10)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["ok"] is True
        assert body["message"] == "Got it — thank you."

        after = api_client.get(f"{API}/profile", timeout=10).json()
        assert after["observedMissions"] == obs_before + 1
        # process still greater than outcome after evolution
        for d in after["dimensions"]:
            assert d["process"] > d["outcome"]

    def test_submission_unknown_mission_404(self, api_client):
        r = api_client.post(
            f"{API}/submissions",
            json={"missionId": "nope", "type": "text", "answers": []},
            timeout=10,
        )
        assert r.status_code == 404
