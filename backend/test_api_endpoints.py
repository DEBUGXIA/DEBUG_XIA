#!/usr/bin/env python
"""Test API endpoints"""
import os
import django
import json
import requests
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

# Start fresh
print("=" * 60)
print("API ENDPOINT TEST")
print("=" * 60)

BASE_URL = 'http://localhost:8000'

# Generate unique username and email
unique_id = random.randint(10000, 99999)
username = f'testuser{unique_id}'
email = f'test{unique_id}@example.com'

# 1. Test signup
print("\n1. Testing Signup...")
signup_data = {
    'username': username,
    'email': email,
    'password': 'Password123456',
    'password_confirm': 'Password123456',
    'first_name': 'Test',
    'last_name': 'User'
}

try:
    response = requests.post(f'{BASE_URL}/api/users/signup/', json=signup_data)
    print(f"   Status: {response.status_code}")
    if response.status_code == 201:
        data = response.json()
        print(f"   ✓ Signup successful")
        print(f"   User: {data['user']['username']}")
        access_token = data['access']
        refresh_token = data['refresh']
        print(f"   Access token saved")
    else:
        print(f"   ✗ Signup failed")
        print(f"   Response: {response.json()}")
        exit(1)
except Exception as e:
    print(f"   ✗ Error: {e}")
    exit(1)

# 2. Test /users/me/ with token
print("\n2. Testing /users/me/ endpoint with token...")
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

try:
    response = requests.get(f'{BASE_URL}/api/users/me/', headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ /users/me/ successful")
        print(f"   User data: {json.dumps(data, indent=2)}")
    else:
        print(f"   ✗ /users/me/ failed")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# 3. Test token refresh
print("\n3. Testing token refresh...")
refresh_data = {
    'refresh': refresh_token
}

try:
    response = requests.post(f'{BASE_URL}/token/refresh/', json=refresh_data)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print(f"   ✓ Token refresh successful")
    else:
        print(f"   ✗ Token refresh failed")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# 4. Test /profiles/update_my_profile/ endpoint
print("\n4. Testing /profiles/update_my_profile/ endpoint...")
profile_data = {
    'company': 'Test Company',
    'location': 'Test City',
    'website': 'https://example.com'
}

try:
    response = requests.put(f'{BASE_URL}/api/profiles/update_my_profile/', 
                           json=profile_data, headers=headers)
    print(f"   Status: {response.status_code}")
    print(f"   Content-Type: {response.headers.get('content-type')}")
    print(f"   Raw response: {response.text[:200]}")
    if response.status_code == 200:
        print(f"   ✓ Profile update successful")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"   ✗ Profile update failed")
        try:
            print(f"   Response: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"   Response text: {response.text}")
except Exception as e:
    print(f"   ✗ Error: {e}")

print("\n" + "=" * 60)
