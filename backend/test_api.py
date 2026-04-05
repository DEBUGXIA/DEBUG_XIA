#!/usr/bin/env python
"""
Quick test script to verify backend API endpoints are working
Run this after starting the Django server: python manage.py runserver
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

# Test credentials
TEST_EMAIL = f"test_user_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com"
TEST_USERNAME = f"testuser_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
TEST_PASSWORD = "TestPassword123!"

def print_result(test_name, success, message=""):
    status = "✓ PASS" if success else "✗ FAIL"
    print(f"\n{status}: {test_name}")
    if message:
        print(f"  {message}")

def test_signup():
    """Test user signup"""
    url = f"{BASE_URL}/users/signup/"
    data = {
        "email": TEST_EMAIL,
        "username": TEST_USERNAME,
        "first_name": "Test",
        "last_name": "User",
        "password": TEST_PASSWORD,
        "password_confirm": TEST_PASSWORD
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 201:
            result = response.json()
            global ACCESS_TOKEN
            ACCESS_TOKEN = result.get('access')
            print_result("User Signup", True, f"User created: {TEST_EMAIL}")
            return True
        else:
            print_result("User Signup", False, f"Status: {response.status_code}, {response.text}")
            return False
    except Exception as e:
        print_result("User Signup", False, str(e))
        return False

def test_get_current_user():
    """Test getting current user"""
    url = f"{BASE_URL}/users/me/"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            user = response.json()
            print_result("Get Current User", True, f"User: {user.get('email')}")
            return True
        else:
            print_result("Get Current User", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Get Current User", False, str(e))
        return False

def test_create_error_log():
    """Test creating an error log"""
    url = f"{BASE_URL}/errors/"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    data = {
        "error_type": "TypeError",
        "error_message": "Cannot read property 'map' of undefined",
        "severity": "high",
        "status": "unresolved",
        "file_path": "src/components/Main.js",
        "line_number": 42,
        "code_snippet": "items.map(i => i.value)",
        "ai_suggestion": "Check if 'items' is defined before calling map()"
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        if response.status_code == 201:
            error = response.json()
            global ERROR_ID
            ERROR_ID = error.get('id')
            print_result("Create Error Log", True, f"Error created: {error.get('error_type')}")
            return True
        else:
            print_result("Create Error Log", False, f"Status: {response.status_code}, {response.text}")
            return False
    except Exception as e:
        print_result("Create Error Log", False, str(e))
        return False

def test_get_error_logs():
    """Test getting error logs"""
    url = f"{BASE_URL}/errors/"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            errors = response.json()
            print_result("Get Error Logs", True, f"Found {len(errors)} errors")
            return True
        else:
            print_result("Get Error Logs", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Get Error Logs", False, str(e))
        return False

def test_error_statistics():
    """Test getting error statistics"""
    url = f"{BASE_URL}/errors/statistics/"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            stats = response.json()
            print_result("Error Statistics", True, f"Total: {stats.get('total_errors')}, Resolved: {stats.get('resolved')}")
            return True
        else:
            print_result("Error Statistics", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Error Statistics", False, str(e))
        return False

def test_mark_error_resolved():
    """Test marking error as resolved"""
    if ERROR_ID is None:
        print_result("Mark Error Resolved", False, "No error ID available")
        return False
    
    url = f"{BASE_URL}/errors/{ERROR_ID}/mark_resolved/"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    
    try:
        response = requests.put(url, json={}, headers=headers)
        if response.status_code == 200:
            error = response.json()
            print_result("Mark Error Resolved", True, f"Status: {error.get('status')}")
            return True
        else:
            print_result("Mark Error Resolved", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Mark Error Resolved", False, str(e))
        return False

def test_execute_code():
    """Test code execution"""
    url = f"{BASE_URL}/executions/"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    data = {
        "language": "python",
        "code": "print('Hello from DEBUG_XIA!')"
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        if response.status_code == 201:
            execution = response.json()
            print_result("Execute Code", True, f"Language: {execution.get('language')}")
            return True
        else:
            print_result("Execute Code", False, f"Status: {response.status_code}, {response.text}")
            return False
    except Exception as e:
        print_result("Execute Code", False, str(e))
        return False

def test_get_executions():
    """Test getting code executions"""
    url = f"{BASE_URL}/executions/"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            executions = response.json()
            print_result("Get Code Executions", True, f"Found {len(executions)} executions")
            return True
        else:
            print_result("Get Code Executions", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_result("Get Code Executions", False, str(e))
        return False

def test_create_analysis():
    """Test creating an analysis"""
    url = f"{BASE_URL}/analysis/"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    data = {
        "analysis_type": "quality",
        "code": "function add(a, b) { return a + b; }",
        "suggestions": "Consider adding JSDoc comments",
        "score": 8.5,
        "improvements": {"comments": "Add JSDoc", "naming": "Good"}
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        if response.status_code == 201:
            analysis = response.json()
            print_result("Create Analysis", True, f"Type: {analysis.get('analysis_type')}, Score: {analysis.get('score')}")
            return True
        else:
            print_result("Create Analysis", False, f"Status: {response.status_code}, {response.text}")
            return False
    except Exception as e:
        print_result("Create Analysis", False, str(e))
        return False

def run_all_tests():
    """Run all tests"""
    print("\n" + "="*60)
    print("DEBUG_XIA Backend API Test Suite")
    print("="*60)
    print(f"\nBase URL: {BASE_URL}")
    print(f"Test Email: {TEST_EMAIL}")
    print(f"Test Username: {TEST_USERNAME}")
    
    tests = [
        ("Authentication", test_signup),
        ("Get Current User", test_get_current_user),
        ("Create Error Log", test_create_error_log),
        ("Get Error Logs", test_get_error_logs),
        ("Error Statistics", test_error_statistics),
        ("Mark Error Resolved", test_mark_error_resolved),
        ("Execute Code", test_execute_code),
        ("Get Code Executions", test_get_executions),
        ("Create Analysis", test_create_analysis),
    ]
    
    results = []
    for test_name, test_func in tests:
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "="*60)
    print("Test Summary")
    print("="*60)
    passed = sum(1 for _, result in results if result)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    for test_name, result in results:
        status = "✓" if result else "✗"
        print(f"  {status} {test_name}")
    print("="*60 + "\n")

if __name__ == "__main__":
    ACCESS_TOKEN = None
    ERROR_ID = None
    
    try:
        run_all_tests()
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user")
    except Exception as e:
        print(f"\n\nFatal error: {e}")
