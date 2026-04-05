#!/usr/bin/env python
"""
Diagnostic script to verify profile picture upload is working correctly
Run this after uploading to see what was saved in the database
"""

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from debugxia_api.users.models import User

print("\n" + "="*70)
print("🔍 PROFILE PICTURE DIAGNOSTIC")
print("="*70 + "\n")

# Get all users
users = User.objects.all()
print(f"Total users: {len(users)}\n")

for user in users:
    print(f"User: {user.username}")
    print(f"  Email: {user.email}")
    print(f"  Profile Image Field Value: {user.profile_image}")
    
    if user.profile_image:
        # Check if file actually exists
        full_path = user.profile_image.path
        print(f"  Full Path: {full_path}")
        print(f"  File Exists: {os.path.exists(full_path)}")
        if os.path.exists(full_path):
            print(f"  File Size: {os.path.getsize(full_path)} bytes")
        
        # Check the URL
        print(f"  URL: {user.profile_image.url}")
    else:
        print(f"  Profile Image: None")
    
    print()

print("="*70)
