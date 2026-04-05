#!/usr/bin/env python
"""Test standard ViewSet endpoints"""
import os
import django
import json
import requests
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

from debugxia_api.users.models import User, UserProfile
from rest_framework_simplejwt.tokens import RefreshToken

# Create a test user with unique email
unique_id = random.randint(10000, 99999)
username = f'stdtest{unique_id}'
email = f'std{unique_id}@test.com'

# Clean up if exists
User.objects.filter(username=username).delete()

user = User.objects.create_user(
    username=username,
    email=email,
    password='Test123456'
)

# Create a profile for the user
profile = UserProfile.objects.create(user=user, company='Test Co')

# Get tokens
refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)

print("Testing ViewSet endpoints...")
print(f"User: {user.username} (ID: {user.id})")
print(f"Profile: {profile.id}")
print()

headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

# Test 1: GET profile list
print("1. Testing GET /api/profiles/")
response = requests.get('http://localhost:8000/api/profiles/', headers=headers)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"   ✓ Success, profiles: {data}")
    profile_ids = [p['id'] for p in data] if isinstance(data, list) else [data['id']]
    profile_id = profile_ids[0] if profile_ids else None
else:
    print(f"   Response: {response.json()}")
    profile_id = profile.id

# Test 2: PUT to the profile (standard viewset endpoint)
if profile_id:
    print(f"\n2. Testing PUT /api/profiles/{profile_id}/")
    update_data = {
        'company': 'Updated Company',
        'location': 'New City',
        'website': 'https://example.com'
    }
    response = requests.put(f'http://localhost:8000/api/profiles/{profile_id}/', 
                           json=update_data, headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print(f"   ✓ Success")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"   Response: {response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:200]}")
