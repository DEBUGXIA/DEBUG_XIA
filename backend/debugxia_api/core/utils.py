"""
Utilities for the debugxia_api project
"""
from rest_framework.response import Response
from rest_framework import status


class APIResponse:
    """Helper class for consistent API responses"""
    
    @staticmethod
    def success(message, data=None, status_code=status.HTTP_200_OK):
        """Return a success response"""
        response_data = {
            'success': True,
            'message': message,
        }
        if data:
            response_data['data'] = data
        return Response(response_data, status=status_code)

    @staticmethod
    def error(message, errors=None, status_code=status.HTTP_400_BAD_REQUEST):
        """Return an error response"""
        response_data = {
            'success': False,
            'message': message,
        }
        if errors:
            response_data['errors'] = errors
        return Response(response_data, status=status_code)
