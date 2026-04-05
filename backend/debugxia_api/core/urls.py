from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from debugxia_api.users.views import (
    UserViewSet, UserProfileView, ErrorLogViewSet, 
    CodeExecutionViewSet, AnalysisHistoryViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'errors', ErrorLogViewSet, basename='error')
router.register(r'executions', CodeExecutionViewSet, basename='execution')
router.register(r'analysis', AnalysisHistoryViewSet, basename='analysis')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # JWT Token Endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # User Profile API (simplified)
    path('api/profiles/me/', UserProfileView.as_view(), name='profile_me'),
    
    # API Routes
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
