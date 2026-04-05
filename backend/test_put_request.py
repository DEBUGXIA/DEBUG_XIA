#!/usr/bin/env python
"""Test the HTTP PUT request to profile endpoint with FormData"""
import requests
import os
from pathlib import Path

# Get test credentials
API_BASE = 'http://localhost:8000/api'
EMAIL_OR_USERNAME = 'test@lol.com'  # Use email
PASSWORD = 'test'

print("="*60)
print("TESTING HTTP PUT REQUEST WITH FormData")
print("="*60)

# Step 1: Get access token
print("\n1️⃣  Getting access token...")
token_response = requests.post(f'{API_BASE}/users/signin/', json={
    'email': EMAIL_OR_USERNAME,
    'password': PASSWORD
})

if token_response.status_code != 200:
    print(f"❌ Failed to get token: {token_response.status_code}")
    print(f"   Response: {token_response.text}")
    exit(1)

token = token_response.json().get('access')
print(f"✅ Token: {token[:30]}...")

# Step 2: Create FormData with an image
print("\n2️⃣  Creating FormData with test image...")
from PIL import Image
import io

# Create a simple red image
img = Image.new('RGB', (100, 100), color='red')
img_io = io.BytesIO()
img.save(img_io, 'JPEG')
img_io.seek(0)

files = {
    'profile_image': ('tiger_test.jpg', img_io, 'image/jpeg'),
    'bio': (None, 'Updated bio from test'),
    'phone_number': (None, '9999999999'),
}

print(f"✅ FormData created:")
for key in files:
    if files[key][1]:
        if isinstance(files[key][1], io.BytesIO):
            print(f"   - {key}: File (BytesIO, {len(files[key][1].getvalue())} bytes)")
        else:
            print(f"   - {key}: {files[key][1]}")

# Step 3: Send PUT request
print("\n3️⃣  Sending PUT request to /profiles/me/...")
headers = {
    'Authorization': f'Bearer {token}',
    # DON'T set Content-Type - let requests set it for multipart
}

response = requests.put(
    f'{API_BASE}/profiles/me/',
    files=files,
    headers=headers
)

print(f"   Status: {response.status_code}")
print(f"   Content-Type: {response.headers.get('Content-Type')}")

if response.status_code == 200:
    print(f"✅ SUCCESS!")
    data = response.json()
    if 'user' in data:
        profile_image = data['user'].get('profile_image')
        print(f"   - Profile image URL: {profile_image}")
    print(f"\n📝 Full response:")
    import json
    print(json.dumps(data, indent=2))
else:
    print(f"❌ FAILED!")
    print(f"   Response text: {response.text}")

print("\n" + "="*60)
