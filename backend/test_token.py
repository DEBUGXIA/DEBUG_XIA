import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

from rest_framework_simplejwt.tokens import AccessToken
from debugxia_api.users.models import User

# Test token generation for admin user
admin_user = User.objects.get(email='admin@example.com')
print(f"\n✓ Admin user found: {admin_user.email}")

# Create a token
token = AccessToken.for_user(admin_user)
print(f"\n✓ Token created: {str(token)[:50]}...")

# Test if we can decode it
try:
    decoded = AccessToken(str(token))
    print(f"\n✓ Token is valid")
    print(f"  - User ID: {decoded['user_id']}")
    print(f"  - Exp: {decoded.get('exp')}")
except Exception as e:
    print(f"\n✗ Token is invalid: {e}")

print(f"\nYou can test with:")
print(f"  curl -H 'Authorization: Bearer {str(token)}' http://localhost:8000/api/users/me/")
