import os
from pathlib import Path

# Check if media directory exists
media_dir = Path('media')
if media_dir.exists():
    print(f"✅ Media directory exists: {media_dir.absolute()}")
    
    # List all files in media directory
    for root, dirs, files in os.walk(media_dir):
        level = root.replace(str(media_dir), '').count(os.sep)
        indent = ' ' * 2 * level
        print(f'{indent}{os.path.basename(root)}/')
        
        sub_indent = ' ' * 2 * (level + 1)
        for file in files:
            file_path = os.path.join(root, file)
            file_size = os.path.getsize(file_path)
            print(f'{sub_indent}{file} ({file_size:,} bytes)')
else:
    print("❌ Media directory does not exist")
    print(f"Expected path: {media_dir.absolute()}")

# Check Django settings
print("\n" + "="*60)
print("Django Settings Check:")
print("="*60)

import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

from django.conf import settings
print(f"MEDIA_URL: {settings.MEDIA_URL}")
print(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
print(f"DEBUG: {settings.DEBUG}")

# Check if any users have profile_image
print("\n" + "="*60)
print("User Profile Images:")
print("="*60)

from debugxia_api.users.models import User

users = User.objects.all()
for user in users:
    if user.profile_image:
        print(f"✅ {user.username}: {user.profile_image}")
    else:
        print(f"❌ {user.username}: No profile image")
