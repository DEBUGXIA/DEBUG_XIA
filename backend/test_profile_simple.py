#!/usr/bin/env python
"""Simple profile test"""
import os
import django
import json
import requests
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

from debugxia_api.users.models import User, UserProfile

# Create a test user with unique email
unique_id = random.randint(10000, 99999)
username = f'profiletest{unique_id}'
email = f'profiletest{unique_id}@test.com'

# Clean up if exists
User.objects.filter(username=username).delete()

user = User.objects.create_user(
    username=username,
    email=email,
    password='Test123456'
)

# Get tokens
from rest_framework_simplejwt.tokens import RefreshToken
refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)

print("Testing profile endpoint...")
print(f"User: {user.username} (ID: {user.id})")

# Test profile update
BASE_URL = 'http://localhost:8000'
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

profile_data = {
    'company': 'Test Company',
    'location': 'Test City',
    'website': 'https://example.com'
}

print("\nMaking PUT request to /api/profiles/update_my_profile/")
response = requests.put(
    f'{BASE_URL}/api/profiles/update_my_profile/',
    json=profile_data,
    headers=headers
)

print(f"Status: {response.status_code}")
print(f"Headers: {dict(response.headers)}")
print(f"Body: {response.text[:500]}")

if response.status_code == 200:
    print("\n✓ Success!")
    print(json.dumps(response.json(), indent=2))
