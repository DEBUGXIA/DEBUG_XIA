#!/usr/bin/env python
"""Detailed JWT token diagnostic"""
import os
import django
import json
import requests
import jwt
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

print("=" * 70)
print("DETAILED JWT TOKEN DIAGNOSTIC")
print("=" * 70)

BASE_URL = 'http://localhost:8000'
SECRET_KEY = 'django-insecure-dev-key-change-in-production'

# Get fresh user from database
from debugxia_api.users.models import User

# Clean up previous test user
User.objects.filter(username='diagnosticuser').delete()

# Create new test user
print("\n1. Creating test user in database...")
user = User.objects.create_user(
    username='diagnosticuser',
    email='diagnostic@test.com',
    password='Test123456',
    first_name='Diagnostic',
    last_name='User'
)
print(f"   ✓ User created")
print(f"   User ID: {user.id}")
print(f"   Username: {user.username}")
print(f"   Is active: {user.is_active}")

# Sign in via API
print("\n2. Signing in via API...")
signin_data = {
    'email': 'diagnosticuser',
    'password': 'Test123456'
}

response = requests.post(f'{BASE_URL}/api/users/signin/', json=signin_data)
print(f"   Signin Status: {response.status_code}")

if response.status_code != 200:
    print(f"   ✗ Signin failed: {response.json()}")
    # Try with email instead
    signin_data['email'] = 'diagnostic@test.com'
    response = requests.post(f'{BASE_URL}/api/users/signin/', json=signin_data)
    print(f"   Retry Status: {response.status_code}")
    if response.status_code != 200:
        print(f"   Response: {response.json()}")
        exit(1)

data = response.json()
access_token = data['access']
refresh_token = data['refresh']
print(f"   ✓ Signin successful")

# Decode token without verification to see the payload
print("\n3. Decoding access token (without verification)...")
try:
    decoded = jwt.decode(access_token, options={"verify_signature": False})
    print(f"   Token payload:")
    for key, value in decoded.items():
        if key == 'exp':
            print(f"   - {key}: {datetime.fromtimestamp(value)}")
        else:
            print(f"   - {key}: {value}")
    
    token_user_id = decoded.get('user_id')
    print(f"\n   Token user_id: {token_user_id}")
    print(f"   Database user_id: {user.id}")
    print(f"   Match: {token_user_id == user.id}")
except Exception as e:
    print(f"   ✗ Error decoding: {e}")

# Check if user still exists in database
print("\n4. Verifying user still in database...")
try:
    db_user = User.objects.get(id=token_user_id)
    print(f"   ✓ User found in database: {db_user.username}")
    print(f"   Is active: {db_user.is_active}")
except User.DoesNotExist:
    print(f"   ✗ User NOT found in database with ID {token_user_id}")
    print(f"   Available users:")
    for u in User.objects.all():
        print(f"   - ID {u.id}: {u.username}")

# Test /users/me/ endpoint
print("\n5. Testing /users/me/ with token...")
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

response = requests.get(f'{BASE_URL}/api/users/me/', headers=headers)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   ✓ Success!")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")
else:
    print(f"   ✗ Failed")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")

print("\n" + "=" * 70)
