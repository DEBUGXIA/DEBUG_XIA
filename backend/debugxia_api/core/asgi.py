"""ASGI config for debugxia_api project."""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')

application = get_asgi_application()
