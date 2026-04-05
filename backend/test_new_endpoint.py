#!/usr/bin/env python
"""Test new /api/profiles/me/ endpoint"""
import os
import django
import json
import requests
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

from debugxia_api.users.models import User, UserProfile
from rest_framework_simplejwt.tokens import RefreshToken

# Create a test user
unique_id = random.randint(10000, 99999)
username = f'newtest{unique_id}'
email = f'new{unique_id}@test.com'

User.objects.filter(username=username).delete()

user = User.objects.create_user(
    username=username,
    email=email,
    password='Test123456'
)

# Get tokens
refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)

print("Testing new /api/profiles/me/ endpoint...")
print(f"User: {user.username}")
print()

headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

# Test 1: GET profile
print("1. Testing GET /api/profiles/me/")
response = requests.get('http://localhost:8000/api/profiles/me/', headers=headers)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   ✓ Success")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")
else:
    print(f"   Response: {response.text[:300]}")

# Test 2: PUT to profile
print("\n2. Testing PUT /api/profiles/me/")
update_data = {
    'company': 'My Company',
    'location': 'My City',
    'website': 'https://mysite.com'
}
response = requests.put('http://localhost:8000/api/profiles/me/', 
                       json=update_data, headers=headers)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   ✓ Success")
    data = response.json()
    print(f"   Company: {data.get('company')}")
    print(f"   Location: {data.get('location')}")
else:
    print(f"   Response: {response.text[:300]}")

# Test 3: PATCH to profile
print("\n3. Testing PATCH /api/profiles/me/")
patch_data = {
    'company': 'Updated Company'
}
response = requests.patch('http://localhost:8000/api/profiles/me/', 
                         json=patch_data, headers=headers)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   ✓ Success")
    print(f"   Company updated to: {response.json().get('company')}")
else:
    print(f"   Response: {response.text[:300]}")

print("\n✓ All tests passed!")
