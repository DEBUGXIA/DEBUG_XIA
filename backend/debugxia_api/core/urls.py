from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from debugxia_api.users.views import (
    UserViewSet, UserProfileViewSet, ErrorLogViewSet, 
    CodeExecutionViewSet, AnalysisHistoryViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'errors', ErrorLogViewSet, basename='error')
router.register(r'executions', CodeExecutionViewSet, basename='execution')
router.register(r'analysis', AnalysisHistoryViewSet, basename='analysis')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
