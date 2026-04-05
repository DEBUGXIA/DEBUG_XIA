#!/usr/bin/env python
"""
Test profile picture functionality using the actual API endpoints (requires running server)
"""

import requests
import json
import os
from pathlib import Path

API_URL = "http://localhost:8000/api"

def test_with_live_server():
    """Test using the actual running Django server"""
    print("\n" + "="*70)
    print("🧪 PROFILE PICTURE FLOW TEST (LIVE SERVER)")
    print("="*70)
    
    session = requests.Session()
    
    # 1. Try to get current user without token (should fail)
    print("\n1️⃣  Testing unauthenticated access (should fail)...")
    response = session.get(f"{API_URL}/users/me/")
    if response.status_code == 401:
        print(f"   ✅ Correctly rejected unauthenticated request: {response.status_code}")
    else:
        print(f"   ⚠️  Unexpected status: {response.status_code}")
    
    # 2. Try to signin (we'll need a real user)
    print("\n2️⃣  Testing signin (requires existing user)...")
    signin_response = session.post(
        f"{API_URL}/users/signin/",
        json={
            "email": "test@example.com",
            "password": "testpass123"
        }
    )
    
    if signin_response.status_code == 200:
        print(f"   ✅ Signin successful!")
        data = signin_response.json()
        access_token = data.get('access')
        
        if access_token:
            print(f"   Token: {access_token[:30]}...")
            
            # 3. Get current user
            print("\n3️⃣  Getting current user info...")
            response = session.get(
                f"{API_URL}/users/me/",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if response.status_code == 200:
                user_data = response.json()
                print(f"   ✅ User retrieved: {user_data.get('username')}")
                print(f"   Email: {user_data.get('email')}")
                print(f"   Profile image: {user_data.get('profile_image')}")
            else:
                print(f"   ❌ Failed to get user: {response.status_code}")
                print(f"   Response: {response.text}")
            
            # 4. Test GET /profiles/me/
            print("\n4️⃣  Testing GET /api/profiles/me/...")
            response = session.get(
                f"{API_URL}/profiles/me/",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if response.status_code == 200:
                profile_data = response.json()
                print(f"   ✅ Profile retrieved!")
                if 'user' in profile_data and 'profile_image' in profile_data['user']:
                    profile_image = profile_data['user']['profile_image']
                    print(f"   Profile image URL: {profile_image}")
                    
                    if profile_image and profile_image.startswith('http'):
                        print(f"   ✅ Returns absolute URL!")
                    else:
                        print(f"   ⚠️  Relative URL or None")
                else:
                    print(f"   Profile data keys: {profile_data.keys()}")
            else:
                print(f"   ❌ Failed to get profile: {response.status_code}")
                print(f"   Response: {response.text}")
            
            # 5. Test uploading an image
            print("\n5️⃣  Testing image upload (multipart)...")
            
            # Create a test image
            from PIL import Image
            from io import BytesIO
            
            image = Image.new('RGB', (100, 100), color='red')
            img_buffer = BytesIO()
            image.save(img_buffer, format='JPEG')
            img_buffer.seek(0)
            
            files = {
                'profile_image': ('test_profile.jpg', img_buffer, 'image/jpeg'),
            }
            
            data = {
                'bio': 'Updated bio from API test',
                'phone_number': '+1-555-0123',
            }
            
            response = session.put(
                f"{API_URL}/profiles/me/",
                files=files,
                data=data,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if response.status_code == 200:
                print(f"   ✅ Image upload successful!")
                result = response.json()
                if 'user' in result and 'profile_image' in result['user']:
                    new_url = result['user']['profile_image']
                    print(f"   New image URL: {new_url}")
                    
                    # Verify file exists
                    if 'media/' in new_url:
                        print(f"   ✅ URL contains /media/ path!")
                    
                    # Check if URL is accessible
                    if new_url and new_url.startswith('http'):
                        print(f"   Attempting to fetch image...")
                        img_response = session.get(new_url)
                        if img_response.status_code == 200:
                            print(f"   ✅ Image is accessible! Size: {len(img_response.content)} bytes")
                        else:
                            print(f"   ⚠️  Image not accessible: {img_response.status_code}")
                else:
                    print(f"   Response keys: {result.keys()}")
            else:
                print(f"   ❌ Upload failed: {response.status_code}")
                print(f"   Response: {response.text}")
        else:
            print(f"   ❌ No access token in response!")
    else:
        print(f"   ⚠️  Signin failed: {signin_response.status_code}")
        print(f"   Response: {signin_response.text}")
        print("\n   📌 Make sure you have a test user with email=test@example.com and password=testpass123")
    
    print("\n" + "="*70)
    print("✅ TEST COMPLETE")
    print("="*70 + "\n")

if __name__ == '__main__':
    try:
        test_with_live_server()
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to API server at http://localhost:8000")
        print("   Please ensure the Django development server is running!")
        print("   Run: python manage.py runserver\n")
    except Exception as e:
        print(f"\n❌ ERROR: {e}\n")
