#!/usr/bin/env python
"""List all registered API endpoints"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debugxia_api.core.settings')
django.setup()

from debugxia_api.core.urls import router

print("=" * 70)
print("REGISTERED API ENDPOINTS")
print("=" * 70)

for prefix, viewset, basename in router.registry:
    print(f"\nViewSet: {basename}")
    print(f"  Prefix: {prefix}")
    print(f"  ViewSet class: {viewset.__name__}")
    
    # Get the URLs from the router
    urls = router.get_urls()
    viewset_urls = [url for url in urls if basename in str(url)]
    
    for url in viewset_urls:
        pattern = url.pattern
        print(f"  - {pattern}")

print("\n" + "=" * 70)
