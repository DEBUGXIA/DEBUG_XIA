#!/usr/bin/env python
"""Test authentication flow"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

from debugxia_api.users.models import User, UserProfile
from rest_framework_simplejwt.tokens import RefreshToken
import json

print("=" * 60)
print("AUTHENTICATION TEST")
print("=" * 60)

# 1. Check if any users exist
print("\n1. Checking existing users...")
users = User.objects.all()
print(f"   Total users: {users.count()}")
for user in users:
    print(f"   - {user.username} ({user.email})")
    print(f"     Has profile: {hasattr(user, 'profile')}")
    if hasattr(user, 'profile'):
        print(f"     Profile exists: {user.profile is not None}")

# 2. Create a test user if needed
print("\n2. Creating test user if needed...")
test_user, created = User.objects.get_or_create(
    username='testuser',
    defaults={
        'email': 'test@example.com',
        'first_name': 'Test',
        'last_name': 'User',
        'is_active': True
    }
)

if created:
    test_user.set_password('Test123456')
    test_user.save()
    print(f"   ✓ Created new test user: {test_user.username}")
else:
    print(f"   ✓ Test user exists: {test_user.username}")

# 3. Ensure UserProfile exists
print("\n3. Checking UserProfile...")
profile, profile_created = UserProfile.objects.get_or_create(user=test_user)
if profile_created:
    print(f"   ✓ Created UserProfile for {test_user.username}")
else:
    print(f"   ✓ UserProfile exists for {test_user.username}")

# 4. Generate tokens
print("\n4. Generating JWT tokens...")
refresh = RefreshToken.for_user(test_user)
access_token = str(refresh.access_token)
refresh_token = str(refresh)

print(f"   Access token (first 50 chars): {access_token[:50]}...")
print(f"   Refresh token (first 50 chars): {refresh_token[:50]}...")

# 5. Verify user can be retrieved
print("\n5. Verifying user retrieval...")
try:
    user = User.objects.get(id=test_user.id)
    print(f"   ✓ User retrieved: {user.username}")
    print(f"     ID: {user.id}")
    print(f"     Email: {user.email}")
except User.DoesNotExist:
    print(f"   ✗ User NOT found!")

# 6. Test token decoding
print("\n6. Testing token decoding...")
from rest_framework_simplejwt.tokens import Token
try:
    decoded = Token(access_token)
    print(f"   ✓ Access token is valid")
    print(f"   Token user_id: {decoded.get('user_id')}")
except Exception as e:
    print(f"   ✗ Token error: {e}")

# 7. Create demo credentials for manual testing
print("\n7. Demo credentials for manual testing:")
print(f"   Email/Username: {test_user.username}")
print(f"   Email: {test_user.email}")
print(f"   Password: Test123456 (if just created)")

print("\n" + "=" * 60)
