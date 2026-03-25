"""
Custom authentication module for JWT tokens
"""
from rest_framework_simplejwt.authentication import JWTAuthentication as BaseJWTAuthentication
from rest_framework.exceptions import AuthenticationFailed


class CustomJWTAuthentication(BaseJWTAuthentication):
    """
    Custom JWT authentication class with error handling
    """
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except AuthenticationFailed as e:
            raise AuthenticationFailed(str(e))
