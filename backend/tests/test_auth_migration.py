import pytest
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from backend.database import Base, get_db
from backend.models.db_models import User
from backend.services.auth_service import hash_password, verify_password
from backend.api import app

@pytest.fixture
def auth_test_setup():
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    Base.metadata.create_all(bind=test_engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client, TestingSessionLocal
    app.dependency_overrides.clear()

def test_auth_migration_lifecycle(auth_test_setup):
    client, TestingSessionLocal = auth_test_setup

    # 1. Seed user in test database with hashed password
    db = TestingSessionLocal()
    hashed = hash_password("SuperSecret2026!")
    assert hashed != "SuperSecret2026!"
    assert verify_password("SuperSecret2026!", hashed) is True

    test_user = User(
        email="test.auth@nexora.ai",
        password_hash=hashed,
        name="Elena Rostova",
        role="Product Lead",
        company="NEXORA Global Labs"
    )
    db.add(test_user)
    db.commit()
    db.close()

    # 2. Test Missing Credentials
    bad_req = client.post("/api/auth/login", json={"email": "", "password": ""})
    assert bad_req.status_code in [400, 422]

    # 3. Test Unknown User
    unknown_res = client.post("/api/auth/login", json={"email": "nonexistent@nexora.ai", "password": "password123"})
    assert unknown_res.status_code == 401

    # 4. Test Invalid Password
    wrong_pwd_res = client.post("/api/auth/login", json={"email": "test.auth@nexora.ai", "password": "wrongpassword"})
    assert wrong_pwd_res.status_code == 401

    # 5. Test Valid Login
    login_res = client.post("/api/auth/login", json={"email": "test.auth@nexora.ai", "password": "SuperSecret2026!"})
    assert login_res.status_code == 200
    auth_data = login_res.json()["data"]
    token = auth_data["access_token"]
    assert token.startswith("nxt_tok_")
    assert auth_data["user"]["email"] == "test.auth@nexora.ai"
    assert auth_data["user"]["name"] == "Elena Rostova"
    assert "password" not in auth_data["user"]
    assert "password_hash" not in auth_data["user"]

    # 6. Test Authenticated /api/auth/me
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    user_me = me_res.json()["data"]
    assert user_me["email"] == "test.auth@nexora.ai"
    assert user_me["role"] == "Product Lead"
    assert "password_hash" not in user_me

    # 7. Test Unauthenticated /api/auth/me
    unauth_me = client.get("/api/auth/me")
    assert unauth_me.status_code == 401

    # 8. Test Invalid / Expired Token
    bad_token_me = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid_token_xyz"})
    assert bad_token_me.status_code == 401

    # 9. Test Logout
    logout_res = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert logout_res.status_code == 200

    # 10. Verify Token Invalidated After Logout
    post_logout_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert post_logout_me.status_code == 401

    # 11. Test Real User Signup
    signup_res = client.post(
        "/api/auth/signup",
        json={
            "name": "Marcus Vance",
            "email": "marcus.vance@nexora.ai",
            "password": "SecurePassword2026!",
            "company": "Vance Industrial Supply"
        }
    )
    assert signup_res.status_code == 200
    signup_payload = signup_res.json()
    assert signup_payload["success"] is True
    assert signup_payload["data"]["user"]["email"] == "marcus.vance@nexora.ai"
    assert "password_hash" not in signup_payload["data"]["user"]

    # 12. Test Duplicate Signup Returns 400
    dup_res = client.post(
        "/api/auth/signup",
        json={
            "name": "Marcus Vance",
            "email": "marcus.vance@nexora.ai",
            "password": "SecurePassword2026!"
        }
    )
    assert dup_res.status_code == 400

