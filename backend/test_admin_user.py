import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

from debugxia_api.users.models import User

# Check admin user
try:
    user = User.objects.get(email='admin@example.com')
    print(f"\n✓ User found: {user.email}")
    print(f"  Username: {user.username}")
    print(f"  Active: {user.is_active}")
    print(f"  Password hash: {user.password[:20]}...")
    
    # Test password
    password_to_test = 'admin12345'
    if user.check_password(password_to_test):
        print(f"\n✓ Password check PASSED for 'admin12345'")
    else:
        print(f"\n✗ Password check FAILED for 'admin12345'")
        # Try setting a new password
        print(f"  Setting password to 'admin12345'...")
        user.set_password('admin12345')
        user.save()
        if user.check_password('admin12345'):
            print(f"  ✓ Password updated successfully")
except User.DoesNotExist:
    print("✗ User not found")
except Exception as e:
    print(f"✗ Error: {e}")
