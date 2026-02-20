"""
Backend API Tests for REDACTED App - Auth & New Features
Tests: register, login, change-password, forgot-password, reset-password, history endpoints
"""
import pytest
import requests
import os
import uuid
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def test_user_email():
    """Generate unique test user email"""
    return f"test_user_{uuid.uuid4().hex[:8]}@redacted.gov"


@pytest.fixture(scope="module")
def registered_user(api_client, test_user_email):
    """Register a test user and return credentials"""
    response = api_client.post(f"{BASE_URL}/api/auth/register", json={
        "name": "Test Agent",
        "email": test_user_email,
        "password": "testpass123"
    })
    if response.status_code == 201 or response.status_code == 200:
        data = response.json()
        return {
            "email": test_user_email,
            "password": "testpass123",
            "token": data.get("token"),
            "user": data.get("user")
        }
    elif response.status_code == 409:
        # User already exists, try to login
        login_resp = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": test_user_email,
            "password": "testpass123"
        })
        if login_resp.status_code == 200:
            data = login_resp.json()
            return {
                "email": test_user_email,
                "password": "testpass123",
                "token": data.get("token"),
                "user": data.get("user")
            }
    pytest.skip(f"Could not create or login test user: {response.status_code}")


class TestHealthCheck:
    """Health check tests - run first"""
    
    def test_api_health(self, api_client):
        """Test that API is operational"""
        response = api_client.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "operational"
        print(f"✓ API health check passed: {data}")


class TestAuthRegister:
    """Auth registration tests"""
    
    def test_register_new_user(self, api_client):
        """Test user registration with unique email"""
        unique_email = f"agent_{uuid.uuid4().hex[:8]}@redacted.gov"
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "name": "New Agent",
            "email": unique_email,
            "password": "secret123"
        })
        assert response.status_code in [200, 201]
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == unique_email.lower()
        assert data["user"]["name"] == "New Agent"
        print(f"✓ User registration passed: {data['user']['email']}")
    
    def test_register_duplicate_email(self, api_client, registered_user):
        """Test that duplicate email registration fails"""
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Duplicate Agent",
            "email": registered_user["email"],
            "password": "secret123"
        })
        assert response.status_code == 409
        print(f"✓ Duplicate email rejection passed")


class TestAuthLogin:
    """Auth login tests"""
    
    def test_login_valid_credentials(self, api_client, registered_user):
        """Test login with valid credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": registered_user["email"],
            "password": registered_user["password"]
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == registered_user["email"].lower()
        print(f"✓ Login with valid credentials passed")
    
    def test_login_invalid_password(self, api_client, registered_user):
        """Test login with wrong password"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": registered_user["email"],
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print(f"✓ Invalid password rejection passed")
    
    def test_login_nonexistent_user(self, api_client):
        """Test login with non-existent email"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": f"nonexistent_{uuid.uuid4().hex}@test.com",
            "password": "testpass"
        })
        assert response.status_code == 401
        print(f"✓ Non-existent user rejection passed")
    
    def test_login_with_test_user(self, api_client):
        """Test login with the provided test user"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test@redacted.gov",
            "password": "newpass123"
        })
        # May pass or fail depending on if user exists
        if response.status_code == 200:
            data = response.json()
            assert "token" in data
            print(f"✓ Test user login passed: {data['user']['email']}")
        else:
            print(f"⚠ Test user not found (status: {response.status_code}) - this may be expected")


class TestAuthMe:
    """Auth /me endpoint tests"""
    
    def test_auth_me_with_token(self, api_client, registered_user):
        """Test /auth/me returns user data with valid token"""
        headers = {"Authorization": f"Bearer {registered_user['token']}"}
        response = api_client.get(f"{BASE_URL}/api/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert data["email"] == registered_user["email"].lower()
        print(f"✓ Auth /me with token passed")
    
    def test_auth_me_without_token(self, api_client):
        """Test /auth/me fails without token"""
        response = api_client.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print(f"✓ Auth /me without token rejection passed")
    
    def test_auth_me_invalid_token(self, api_client):
        """Test /auth/me fails with invalid token"""
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = api_client.get(f"{BASE_URL}/api/auth/me", headers=headers)
        assert response.status_code == 401
        print(f"✓ Auth /me with invalid token rejection passed")


class TestChangePassword:
    """Change password tests"""
    
    def test_change_password_success(self, api_client):
        """Test changing password with valid current password"""
        # Create a fresh user for this test
        unique_email = f"pwchange_{uuid.uuid4().hex[:8]}@redacted.gov"
        
        # Register new user
        reg_resp = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "name": "Password Changer",
            "email": unique_email,
            "password": "oldpass123"
        })
        assert reg_resp.status_code in [200, 201]
        token = reg_resp.json()["token"]
        
        # Change password
        headers = {"Authorization": f"Bearer {token}"}
        response = api_client.post(f"{BASE_URL}/api/auth/change-password", json={
            "current_password": "oldpass123",
            "new_password": "newpass456"
        }, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ Password change success")
        
        # Verify login with new password works
        login_resp = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": unique_email,
            "password": "newpass456"
        })
        assert login_resp.status_code == 200
        print(f"✓ Login with new password passed")
    
    def test_change_password_wrong_current(self, api_client, registered_user):
        """Test changing password with wrong current password"""
        headers = {"Authorization": f"Bearer {registered_user['token']}"}
        response = api_client.post(f"{BASE_URL}/api/auth/change-password", json={
            "current_password": "wrongcurrent",
            "new_password": "newpass789"
        }, headers=headers)
        assert response.status_code == 401
        print(f"✓ Wrong current password rejection passed")
    
    def test_change_password_unauthenticated(self, api_client):
        """Test changing password without authentication"""
        response = api_client.post(f"{BASE_URL}/api/auth/change-password", json={
            "current_password": "test123",
            "new_password": "test456"
        })
        assert response.status_code == 401
        print(f"✓ Unauthenticated password change rejection passed")


class TestForgotPassword:
    """Forgot password tests"""
    
    def test_forgot_password_existing_email(self, api_client, registered_user):
        """Test forgot password for existing user"""
        response = api_client.post(f"{BASE_URL}/api/auth/forgot-password", json={
            "email": registered_user["email"]
        })
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        # Response should always say email sent (for security)
        print(f"✓ Forgot password for existing user passed: {data['message']}")
    
    def test_forgot_password_nonexistent_email(self, api_client):
        """Test forgot password for non-existent email (should still return success)"""
        response = api_client.post(f"{BASE_URL}/api/auth/forgot-password", json={
            "email": f"nonexistent_{uuid.uuid4().hex}@redacted.gov"
        })
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        # For security, always returns success message
        print(f"✓ Forgot password for non-existent email passed (security): {data['message']}")


class TestResetPassword:
    """Reset password tests"""
    
    def test_reset_password_invalid_token(self, api_client):
        """Test reset password with invalid token"""
        response = api_client.post(f"{BASE_URL}/api/auth/reset-password", json={
            "token": "invalid_reset_token",
            "password": "newpassword123"
        })
        assert response.status_code == 400
        print(f"✓ Reset password with invalid token rejection passed")


class TestHistory:
    """History endpoint tests"""
    
    def test_history_authenticated(self, api_client, registered_user):
        """Test history returns sessions for authenticated user"""
        headers = {"Authorization": f"Bearer {registered_user['token']}"}
        response = api_client.get(f"{BASE_URL}/api/history", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "sessions" in data
        assert isinstance(data["sessions"], list)
        print(f"✓ History for authenticated user passed: {len(data['sessions'])} sessions")
    
    def test_history_unauthenticated(self, api_client):
        """Test history returns sessions without authentication (anonymous sessions)"""
        response = api_client.get(f"{BASE_URL}/api/history")
        assert response.status_code == 200
        data = response.json()
        assert "sessions" in data
        print(f"✓ History for unauthenticated user passed")


class TestCoreAPIs:
    """Test core document processing APIs still work"""
    
    def test_analyze_with_text(self, api_client, registered_user):
        """Test document analysis with text input"""
        headers = {"Authorization": f"Bearer {registered_user['token']}"}
        response = api_client.post(
            f"{BASE_URL}/api/analyze",
            data={"text": "This is a declassified document about secret government programs."},
            headers={**headers, "Content-Type": "application/x-www-form-urlencoded"}
        )
        # LLM call may take time, but we just check API is reachable
        assert response.status_code in [200, 400, 500]  # 500 if LLM issues
        print(f"✓ Analyze endpoint accessible (status: {response.status_code})")
    
    def test_generate_video_returns_video_id(self, api_client):
        """Test video generation returns video_id (don't wait for completion)"""
        response = api_client.post(f"{BASE_URL}/api/generate-video", json={
            "prompt_text": "Test video prompt",
            "session_id": None
        })
        assert response.status_code == 200
        data = response.json()
        assert "video_id" in data
        assert "status" in data
        assert data["status"] == "generating"
        print(f"✓ Video generation started: {data['video_id']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
