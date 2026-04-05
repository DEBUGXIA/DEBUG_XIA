#!/usr/bin/env python
"""Test direct endpoint access"""
import os
import django
import json
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

from debugxia_api.users.models import User, UserProfile
from rest_framework_simplejwt.tokens import RefreshToken
import random

# Create a test user with unique email
unique_id = random.randint(10000, 99999)
username = f'directtest{unique_id}'
email = f'direct{unique_id}@test.com'

# Clean up if exists
User.objects.filter(username=username).delete()

user = User.objects.create_user(
    username=username,
    email=email,
    password='Test123456'
)

# Get tokens
refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)

print("Testing endpoints...")
print(f"User: {user.username} (ID: {user.id})")
print()

# Test  1: /api/users/me/
print("1. Testing GET /api/users/me/")
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

response = requests.get('http://localhost:8000/api/users/me/', headers=headers)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   ✓ Success")
else:
    print(f"   ✗ Failed: {response.json()}")

# Test 2: List profiles endpoint
print("\n2. Testing GET /api/profiles/")
response = requests.get('http://localhost:8000/api/profiles/', headers=headers)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"   ✓ Success, found {len(data) if isinstance(data, list) else 1} profiles")
else:
    print(f"   Status code: {response.status_code}")

# Test 3: UPDATE endpoint with OPTIONS first to see what's allowed
print("\n3. Testing OPTIONS /api/profiles/update_my_profile/")
response = requests.options('http://localhost:8000/api/profiles/update_my_profile/', headers=headers)
print(f"   Status: {response.status_code}")
print(f"   Allow header: {response.headers.get('Allow')}")

# Test 4: Try PATCH instead of PUT
print("\n4. Testing PATCH /api/profiles/update_my_profile/")
profile_data = {
    'company': 'Test Company'
}
response = requests.patch('http://localhost:8000/api/profiles/update_my_profile/', 
                         json=profile_data, headers=headers)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   ✓ Success")
    print(f"   Response: {response.json()}")
else:
    print(f"   Response: {response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:200]}")

# Test 5: Try PUT
print("\n5. Testing PUT /api/profiles/update_my_profile/")
response = requests.put('http://localhost:8000/api/profiles/update_my_profile/', 
                       json=profile_data, headers=headers)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   ✓ Success")
else:
    print(f"   Response: {response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:200]}")
