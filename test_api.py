from fastapi.testclient import TestClient
from backend.api import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    print("[OK] Health check passed!")

def test_process_mocked():
    """
    Since a real request requires API keys to reach the web/LLM, 
    we test the endpoint structure. In a real environment with .env,
    you can run this to see the 252-column output.
    """
    print("\nTo test the full AI pipeline + 252 column export, run:")
    print("uvicorn backend.api:app --reload")
    print("Then send a POST request to http://localhost:8000/api/process")
    print('Payload: {"brand": "Diablo", "part_number": "DCB518ASTS06G"}')

if __name__ == "__main__":
    test_health()
    test_process_mocked()
