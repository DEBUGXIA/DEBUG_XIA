import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

from debugxia_api.users.models import User

# Reset admin password to correct value
admin_user = User.objects.get(email='admin@example.com')
admin_user.set_password('admin12345')
admin_user.save()

print(f"✓ Password set for {admin_user.email}")
print(f"  Username: {admin_user.username}")
print(f"  Password: admin12345")

