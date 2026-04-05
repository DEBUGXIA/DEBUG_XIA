#!/usr/bin/env python
"""Test the complete profile upload flow"""
import os
import sys
import django
from pathlib import Path

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
sys.path.insert(0, str(Path(__file__).parent))
django.setup()

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from debugxia_api.users.models import UserProfile
from django.conf import settings
import io
from PIL import Image

User = get_user_model()

def create_test_image():
    """Create a simple test image"""
    img = Image.new('RGB', (100, 100), color='red')
    img_io = io.BytesIO()
    img.save(img_io, 'JPEG')
    img_io.seek(0)
    return img_io

def test_backend_upload():
    """Test if backend can receive and save uploaded file"""
    print("\n" + "="*60)
    print("TESTING PROFILE UPLOAD BACKEND")
    print("="*60)
    
    # Get test user
    try:
        user = User.objects.get(email='test@lol.com')
        print(f"\n✅ Found test user: {user.username} ({user.email})")
        print(f"   - Current profile_image: {user.profile_image}")
    except User.DoesNotExist:
        print("\n❌ Test user 'test@lol.com' not found!")
        print("   Create account first: test@lol.com / test1, test")
        return
    
    # Check media directory
    media_dir = os.path.join(settings.MEDIA_ROOT, 'user_profiles')
    print(f"\n📁 Media directory: {media_dir}")
    print(f"   - Exists: {os.path.exists(media_dir)}")
    if os.path.exists(media_dir):
        files = os.listdir(media_dir)
        print(f"   - Files in directory: {len(files)}")
        for f in files[:5]:  # Show first 5
            print(f"      • {f}")
    
    # Simulate what Django receives
    print(f"\n📤 Simulating file upload...")
    image_io = create_test_image()
    test_file = SimpleUploadedFile(
        "test_tiger.jpg",
        image_io.getvalue(),
        content_type="image/jpeg"
    )
    print(f"   - File name: {test_file.name}")
    print(f"   - File size: {test_file.size} bytes")
    print(f"   - Content type: {test_file.content_type}")
    
    # Manually write file like the view does
    import uuid
    ext = os.path.splitext(test_file.name)[1]
    filename = f"profile_{user.id}_{uuid.uuid4().hex[:8]}{ext}"
    full_path = os.path.join(media_dir, filename)
    
    print(f"\n💾 Writing file to: {full_path}")
    os.makedirs(media_dir, exist_ok=True)
    
    try:
        file_content = test_file.read()
        with open(full_path, 'wb') as f:
            f.write(file_content)
        print(f"   ✅ File written successfully!")
        print(f"   - Bytes written: {len(file_content)}")
        print(f"   - File exists on disk: {os.path.exists(full_path)}")
        print(f"   - File size on disk: {os.path.getsize(full_path)}")
    except Exception as e:
        print(f"   ❌ ERROR: {e}")
        return
    
    # Update database
    print(f"\n🗄️  Updating database...")
    relative_path = f'user_profiles/{filename}'
    user.profile_image = relative_path
    user.save()
    print(f"   ✅ User saved with profile_image: {user.profile_image}")
    
    # Verify read back
    user.refresh_from_db()
    print(f"\n🔍 Verification:")
    print(f"   - profile_image in DB: {user.profile_image}")
    print(f"   - File exists: {os.path.exists(os.path.join(settings.MEDIA_ROOT, str(user.profile_image)))}")
    
    if user.profile_image:
        file_path = os.path.join(settings.MEDIA_ROOT, str(user.profile_image))
        if os.path.exists(file_path):
            print(f"   - File size: {os.path.getsize(file_path)} bytes ✅")
        else:
            print(f"   - ❌ FILE NOT FOUND!")
    
    print("\n" + "="*60)
    print("UPLOAD TEST COMPLETE")
    print("="*60 + "\n")

if __name__ == '__main__':
    test_backend_upload()
