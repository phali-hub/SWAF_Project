import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

WAF_URL = "http://localhost:5000"
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-key-123")

# We need a valid token to test these endpoints
import jwt
token = jwt.encode(
    {"user_id": 1, "role": "admin"},
    JWT_SECRET,
    algorithm="HS256"
)

headers = {
    "Authorization": f"Bearer {token}"
}

def test_ml_info():
    print("\n🔍 Testing /api/ml/model-info")
    try:
        response = requests.get(f"{WAF_URL}/api/ml/model-info", headers=headers)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

def test_ml_metrics():
    print("\n📊 Testing /api/ml/model-metrics")
    try:
        response = requests.get(f"{WAF_URL}/api/ml/model-metrics", headers=headers)
        print(f"   Status: {response.status_code}")
        # Metrics can be large, just show keys
        data = response.json()
        print(f"   Response Keys: {list(data.keys())}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

def test_ml_reload():
    print("\n🔄 Testing /api/ml/reload")
    try:
        response = requests.post(f"{WAF_URL}/api/ml/reload", headers=headers)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    print("🧪 ML API TEST SUITE 🧪")
    print("=========================================")
    test_ml_info()
    test_ml_metrics()
    test_ml_reload()
    print("\n✅ ML API test sequence finished.")
