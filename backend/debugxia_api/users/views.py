from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from debugxia_api.users.models import User, UserProfile, ErrorLog, CodeExecution, AnalysisHistory
from debugxia_api.users.serializers import (
    UserSerializer, UserProfileSerializer, SignUpSerializer, SignInSerializer,
    ErrorLogSerializer, CodeExecutionSerializer, AnalysisHistorySerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'signup', 'signin']:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['POST'], permission_classes=[AllowAny()])
    def signup(self, request):
        """
        User registration endpoint
        """
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'], permission_classes=[AllowAny()])
    def signin(self, request):
        """
        User login endpoint
        """
        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated()])
    def me(self, request):
        """
        Get current user information
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated()])
    def logout(self, request):
        """
        Logout endpoint (client should delete token)
        """
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['PUT'], permission_classes=[IsAuthenticated()])
    def update_profile(self, request):
        """
        Update user profile information
        """
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for UserProfile model
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        """Get current user's profile"""
        profile = UserProfile.objects.get(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['PUT'])
    def update_my_profile(self, request):
        """Update current user's profile"""
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ErrorLogViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ErrorLog model - Track user code errors
    """
    queryset = ErrorLog.objects.all()
    serializer_class = ErrorLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['severity', 'status', 'error_type']
    search_fields = ['error_message', 'file_path', 'error_type']
    ordering_fields = ['created_at', 'severity']
    ordering = ['-created_at']

    def get_queryset(self):
        """Return error logs for current user"""
        return ErrorLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Create error log for current user"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['GET'])
    def statistics(self, request):
        """Get error statistics for current user"""
        user_errors = ErrorLog.objects.filter(user=request.user)
        stats = {
            'total_errors': user_errors.count(),
            'resolved': user_errors.filter(status='resolved').count(),
            'unresolved': user_errors.filter(status='unresolved').count(),
            'by_severity': {
                'low': user_errors.filter(severity='low').count(),
                'medium': user_errors.filter(severity='medium').count(),
                'high': user_errors.filter(severity='high').count(),
                'critical': user_errors.filter(severity='critical').count(),
            }
        }
        return Response(stats)

    @action(detail=True, methods=['PUT'])
    def mark_resolved(self, request, pk=None):
        """Mark an error as resolved"""
        error = self.get_object()
        error.status = 'resolved'
        error.save()
        serializer = self.get_serializer(error)
        return Response(serializer.data)


class CodeExecutionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CodeExecution model - Track code execution
    """
    queryset = CodeExecution.objects.all()
    serializer_class = CodeExecutionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['language', 'success']
    ordering_fields = ['created_at', 'execution_time']
    ordering = ['-created_at']

    def get_queryset(self):
        """Return code executions for current user"""
        return CodeExecution.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Create code execution for current user"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['GET'])
    def statistics(self, request):
        """Get code execution statistics"""
        user_executions = CodeExecution.objects.filter(user=request.user)
        total_executions = user_executions.count()
        successful = user_executions.filter(success=True).count()
        
        stats = {
            'total_executions': total_executions,
            'successful': successful,
            'failed': total_executions - successful,
            'success_rate': (successful / total_executions * 100) if total_executions > 0 else 0,
            'avg_execution_time': sum([e.execution_time or 0 for e in user_executions]) / total_executions if total_executions > 0 else 0,
        }
        return Response(stats)


class AnalysisHistoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AnalysisHistory model - Track code analysis
    """
    queryset = AnalysisHistory.objects.all()
    serializer_class = AnalysisHistorySerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['analysis_type']
    search_fields = ['suggestions']
    ordering_fields = ['created_at', 'score']
    ordering = ['-created_at']

    def get_queryset(self):
        """Return analysis history for current user"""
        return AnalysisHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Create analysis history for current user"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['GET'])
    def by_type(self, request):
        """Get analysis grouped by type"""
        analysis_type = request.query_params.get('type')
        if analysis_type:
            analyses = AnalysisHistory.objects.filter(user=request.user, analysis_type=analysis_type)
        else:
            analyses = AnalysisHistory.objects.filter(user=request.user)
        
        serializer = self.get_serializer(analyses, many=True)
        return Response(serializer.data)
