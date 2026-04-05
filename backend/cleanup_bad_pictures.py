#!/usr/bin/env python
"""
Clean up profile pictures that don't have files and reset for fresh testing
"""

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from debugxia_api.users.models import User

print("\n" + "="*70)
print("🧹 CLEANING UP BAD PROFILE PICTURES")
print("="*70 + "\n")

# Get all users
users = User.objects.all()

for user in users:
    if user.profile_image:
        # Check if file actually exists
        profile_img_str = str(user.profile_image)
        file_path = os.path.join(os.path.dirname(__file__), 'media', profile_img_str)
        
        if not os.path.exists(file_path):
            print(f"❌ User '{user.username}' has bad profile_image: {profile_img_str}")
            print(f"   File path: {file_path}")
            print(f"   Clearing profile_image field...")
            user.profile_image = None
            user.save()
            print(f"   ✅ Cleared!")
        else:
            print(f"✅ User '{user.username}' has valid profile_image: {profile_img_str}")
            print(f"   File exists: YES ✓")

print("\n" + "="*70)
print("🧹 CLEANUP COMPLETE")
print("="*70 + "\n")
