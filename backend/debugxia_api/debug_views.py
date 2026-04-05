from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_token(request):
    """Debug endpoint to check token and auth"""
    auth_header = request.META.get('HTTP_AUTHORIZATION', 'No Authorization header')
    
    return JsonResponse({
        'auth_header': auth_header[:50] + '...' if len(auth_header) > 50 else auth_header,
        'user': str(request.user),
        'is_authenticated': request.user.is_authenticated,
        'method': request.method,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_protected(request):
    """Protected endpoint for testing"""
    return JsonResponse({
        'user_id': request.user.id,
        'user_email': request.user.email,
        'is_authenticated': request.user.is_authenticated,
    })
