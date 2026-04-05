#!/usr/bin/env python
"""
Test script for profile picture upload and real-time update functionality
Tests the complete flow: login → upload image → verify absolute URL → check media file storage
"""

import os
import sys
import django
import json
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.test import Client
from django.test.utils import setup_test_environment
from django.urls import reverse
from debugxia_api.users.models import User, UserProfile
from rest_framework_simplejwt.tokens import RefreshToken

def create_test_image(filename="test.jpg", size=(100, 100)):
    """Create a test image file"""
    image = Image.new('RGB', size, color='red')
    file_stream = BytesIO()
    image.save(file_stream, format='JPEG')
    file_stream.seek(0)
    return SimpleUploadedFile(filename, file_stream.read(), content_type='image/jpeg')

def get_tokens_for_user(user):
    """Generate JWT tokens for a user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def test_profile_picture_flow():
    """Test the complete profile picture upload and retrieval flow"""
    print("\n" + "="*70)
    print("🧪 PROFILE PICTURE FLOW TEST")
    print("="*70)
    
    client = Client()
    
    # 1. Create or get test user
    print("\n1️⃣  Creating test user...")
    user, created = User.objects.get_or_create(
        username='pictest',
        defaults={
            'email': 'pictest@example.com',
            'first_name': 'Pic',
            'last_name': 'Test',
        }
    )
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"   ✅ Created new user: {user.username}")
    else:
        print(f"   ✅ Using existing user: {user.username}")
    
    # 2. Get tokens
    print("\n2️⃣  Getting JWT tokens...")
    tokens = get_tokens_for_user(user)
    print(f"   ✅ Access token: {tokens['access'][:30]}...")
    
    # 3. Create test image
    print("\n3️⃣  Creating test profile image...")
    test_image = create_test_image("profile_pic_test.jpg")
    print(f"   ✅ Test image created: {test_image.name}")
    
    # 4. Update profile with image
    print("\n4️⃣  Uploading profile picture...")
    headers = {'HTTP_AUTHORIZATION': f'Bearer {tokens["access"]}'}
    
    # Create a new test image for the PUT request
    test_image_data = create_test_image("profile_pic_test2.jpg")
    
    response = client.put(
        '/api/profiles/me/',
        {
            'profile_image': test_image_data,
            'bio': 'Test bio for picture upload',
            'phone_number': '+1234567890',
        },
        **headers
    )
    
    print(f"   Response status: {response.status_code}")
    
    if response.status_code == 200:
        print("   ✅ Upload successful!")
        data = json.loads(response.content)
        print(f"   Response data keys: {data.keys()}")
        
        # Check for profile_image in user data
        if 'user' in data and 'profile_image' in data['user']:
            profile_image_url = data['user']['profile_image']
            print(f"\n5️⃣  Checking absolute URL...")
            print(f"   Profile image URL: {profile_image_url}")
            
            # Verify it's an absolute URL
            if profile_image_url and profile_image_url.startswith('http://'):
                print(f"   ✅ URL is absolute (contains http://)")
            elif profile_image_url and profile_image_url.startswith('https://'):
                print(f"   ✅ URL is absolute (contains https://)")
            else:
                print(f"   ⚠️  URL might be relative: {profile_image_url}")
            
            # Verify file exists in media directory
            print(f"\n6️⃣  Checking media file storage...")
            if profile_image_url:
                # Extract path from URL
                if '8000/media/' in profile_image_url:
                    media_path = profile_image_url.split('8000/media/')[1]
                    full_path = os.path.join(os.path.dirname(__file__), 'media', media_path)
                    print(f"   Expected file path: {full_path}")
                    
                    if os.path.exists(full_path):
                        print(f"   ✅ File exists in media directory!")
                        file_size = os.path.getsize(full_path)
                        print(f"   File size: {file_size} bytes")
                    else:
                        print(f"   ❌ File NOT found at expected location!")
        
        # Verify database update
        print(f"\n7️⃣  Verifying database update...")
        user.refresh_from_db()
        if user.profile_image:
            print(f"   ✅ User.profile_image is set: {user.profile_image}")
            print(f"   Profile image path: {user.profile_image.url}")
        else:
            print(f"   ❌ User.profile_image is NOT set!")
        
    else:
        print(f"   ❌ Upload failed!")
        print(f"   Response content: {response.content}")
        return False
    
    # 8. Test GET endpoint
    print(f"\n8️⃣  Testing GET /api/profiles/me/...")
    response = client.get('/api/profiles/me/', **headers)
    print(f"   Response status: {response.status_code}")
    
    if response.status_code == 200:
        data = json.loads(response.content)
        if 'user' in data and 'profile_image' in data['user']:
            get_image_url = data['user']['profile_image']
            print(f"   Profile image URL from GET: {get_image_url}")
            if get_image_url and get_image_url.startswith('http://'):
                print(f"   ✅ GET endpoint returns absolute URL!")
            else:
                print(f"   ⚠️  GET endpoint might return relative URL")
        else:
            print(f"   ⚠️  Response doesn't contain profile_image")
    else:
        print(f"   ❌ GET request failed!")
    
    print("\n" + "="*70)
    print("✅ PROFILE PICTURE FLOW TEST COMPLETE!")
    print("="*70 + "\n")
    
    return True

if __name__ == '__main__':
    setup_test_environment()
    test_profile_picture_flow()
