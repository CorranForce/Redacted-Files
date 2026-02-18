import requests
import json
import sys
from datetime import datetime

class DeclassifiedAPITester:
    def __init__(self, base_url="https://classified-clips-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.session_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.findings = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=60):
        """Run a single API test"""
        url = f"{self.base_url}/api{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                if isinstance(data, dict):
                    response = requests.post(url, json=data, headers=headers, timeout=timeout)
                else:
                    # For form data (like file uploads)
                    response = requests.post(url, data=data, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.json()}")
                except:
                    print(f"   Response: {response.text}")

            return success, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timed out after {timeout} seconds")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test GET /api/ health check"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "/",
            200
        )
        
        if success and isinstance(response, dict):
            if response.get('status') == 'operational':
                print(f"   ✅ API is operational")
                return True
            else:
                print(f"   ❌ Unexpected status: {response.get('status')}")
        return False

    def test_analyze_text(self):
        """Test POST /api/analyze with text input"""
        sample_text = """CIA Project MKUltra was a top-secret mind control program that used LSD and other drugs on unwitting American citizens. The project ran from 1953 to 1973. Documents reveal the CIA tested on prisoners, mental patients, and drug addicts without consent. The program was officially halted after a Congressional investigation in 1977."""
        
        data = {"text": sample_text}
        success, response = self.run_test(
            "Analyze Document (Text)",
            "POST",
            "/analyze",
            200,
            data,
            timeout=45  # LLM calls take time
        )
        
        if success and isinstance(response, dict):
            if 'id' in response and 'findings' in response:
                self.session_id = response['id']
                self.findings = response['findings']
                print(f"   ✅ Got session_id: {self.session_id}")
                print(f"   ✅ Got {len(self.findings)} findings")
                return True
            else:
                print(f"   ❌ Missing required fields in response")
        return False

    def test_generate_post_twitter(self):
        """Test POST /api/generate-post with platform=twitter"""
        if not self.session_id or not self.findings:
            print("❌ Skipping - No session_id or findings available")
            return False
            
        data = {
            "session_id": self.session_id,
            "platform": "twitter",
            "findings": self.findings
        }
        
        success, response = self.run_test(
            "Generate Twitter Post",
            "POST",
            "/generate-post",
            200,
            data,
            timeout=45  # LLM calls take time
        )
        
        if success and isinstance(response, dict):
            if 'post_text' in response and response['platform'] == 'twitter':
                print(f"   ✅ Generated Twitter post")
                return True
        return False

    def test_generate_post_facebook(self):
        """Test POST /api/generate-post with platform=facebook"""
        if not self.session_id or not self.findings:
            print("❌ Skipping - No session_id or findings available")
            return False
            
        data = {
            "session_id": self.session_id,
            "platform": "facebook", 
            "findings": self.findings
        }
        
        success, response = self.run_test(
            "Generate Facebook Post",
            "POST",
            "/generate-post",
            200,
            data,
            timeout=45
        )
        
        if success and isinstance(response, dict):
            if 'post_text' in response and response['platform'] == 'facebook':
                print(f"   ✅ Generated Facebook post")
                return True
        return False

    def test_generate_post_instagram(self):
        """Test POST /api/generate-post with platform=instagram"""
        if not self.session_id or not self.findings:
            print("❌ Skipping - No session_id or findings available")
            return False
            
        data = {
            "session_id": self.session_id,
            "platform": "instagram",
            "findings": self.findings
        }
        
        success, response = self.run_test(
            "Generate Instagram Post",
            "POST", 
            "/generate-post",
            200,
            data,
            timeout=45
        )
        
        if success and isinstance(response, dict):
            if 'post_text' in response and response['platform'] == 'instagram':
                print(f"   ✅ Generated Instagram post")
                return True
        return False

    def test_get_history(self):
        """Test GET /api/history"""
        success, response = self.run_test(
            "Get History",
            "GET",
            "/history",
            200
        )
        
        if success and isinstance(response, dict):
            if 'sessions' in response:
                sessions = response['sessions']
                print(f"   ✅ Got {len(sessions)} sessions in history")
                return True
        return False

    def test_get_session(self):
        """Test GET /api/session/{session_id}"""
        if not self.session_id:
            print("❌ Skipping - No session_id available")
            return False
            
        success, response = self.run_test(
            "Get Session Details",
            "GET",
            f"/session/{self.session_id}",
            200
        )
        
        if success and isinstance(response, dict):
            if 'session' in response and 'posts' in response:
                print(f"   ✅ Retrieved session with {len(response['posts'])} posts")
                return True
        return False

def main():
    print("🚀 Starting REDACTED API Tests")
    print("=" * 50)
    
    tester = DeclassifiedAPITester()
    
    # Test sequence
    test_results = []
    
    # 1. Health check
    result = tester.test_health_check()
    test_results.append(("Health Check", result))
    
    # 2. Analyze document
    result = tester.test_analyze_text()
    test_results.append(("Analyze Document", result))
    
    # 3. Generate posts for all platforms
    result = tester.test_generate_post_twitter()
    test_results.append(("Generate Twitter Post", result))
    
    result = tester.test_generate_post_facebook()
    test_results.append(("Generate Facebook Post", result))
    
    result = tester.test_generate_post_instagram()
    test_results.append(("Generate Instagram Post", result))
    
    # 4. History and session retrieval
    result = tester.test_get_history()
    test_results.append(("Get History", result))
    
    result = tester.test_get_session()
    test_results.append(("Get Session", result))
    
    # Print results summary
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    for test_name, passed in test_results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    passed_count = sum(1 for _, passed in test_results if passed)
    total_count = len(test_results)
    
    print(f"\nOverall: {passed_count}/{total_count} tests passed")
    print(f"Success Rate: {(passed_count/total_count)*100:.1f}%")
    
    # Return exit code based on results
    return 0 if passed_count == total_count else 1

if __name__ == "__main__":
    sys.exit(main())