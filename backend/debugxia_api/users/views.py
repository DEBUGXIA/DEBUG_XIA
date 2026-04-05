from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.conf import settings

from debugxia_api.users.models import User, UserProfile, ErrorLog, CodeExecution, AnalysisHistory, LoginHistory
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
        try:
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
            else:
                return Response({
                    'detail': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'detail': str(e),
                'error': 'Server error during signup'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['POST'], permission_classes=[AllowAny()])
    def signin(self, request):
        """
        User login endpoint
        """
        try:
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
            else:
                # Return validation errors with proper format
                return Response({
                    'detail': list(serializer.errors.values())[0][0] if serializer.errors else 'Invalid credentials',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'detail': str(e),
                'error': 'Server error during login'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated()])
    def me(self, request):
        """
        Get current user information
        """
        user = request.user
        data = UserSerializer(user).data
        
        # CRITICAL: Convert profile_image to full URL if it's relative
        if data.get('profile_image'):
            profile_image = data['profile_image']
            # If it's a relative path (starts with /), convert to absolute URL
            if isinstance(profile_image, str) and profile_image.startswith('/'):
                data['profile_image'] = request.build_absolute_uri(profile_image)
            elif isinstance(profile_image, str) and not profile_image.startswith('http'):
                # If it's a relative path without leading slash, add /media/ and make absolute
                data['profile_image'] = request.build_absolute_uri(f'/media/{profile_image}')
            
            print(f'[ME] profile_image URL converted to: {data["profile_image"]}')
        
        return Response(data, status=status.HTTP_200_OK)

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


class UserProfileView(APIView):
    """
    Simple API view for user profile management
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get current user's profile"""
        try:
            print(f"[GET] /profiles/me/ called for user: {request.user}")
            
            # Get existing profile or create one
            try:
                profile = UserProfile.objects.get(user=request.user)
                print(f"[GET] Found existing profile: {profile.id}")
            except UserProfile.DoesNotExist:
                print(f"[GET] Creating new profile for user: {request.user}")
                profile = UserProfile.objects.create(user=request.user)
            
            # Return profile data
            profile_image_url = None
            if request.user.profile_image:
                # Build full absolute URL for the image
                relative_url = request.user.profile_image.url
                profile_image_url = request.build_absolute_uri(relative_url)
                print(f"[GET] Profile image URL: {profile_image_url}")
            
            data = {
                'id': profile.id,
                'company': profile.company,
                'location': profile.location,
                'website': profile.website,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'bio': request.user.bio,
                    'phone_number': request.user.phone_number,
                    'profile_image': profile_image_url,
                }
            }
            
            print(f"[GET] Returning profile data: {data}")
            return Response(data, status=status.HTTP_200_OK)
            
        except Exception as e:
            import traceback
            print(f"[ERROR] GET /profiles/me/: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {'detail': f'Error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        """Update current user's profile - PUT"""
        return self.update_profile(request)

    def patch(self, request):
        """Update current user's profile - PATCH"""
        return self.update_profile(request)

    def update_profile(self, request):
        """Helper method to update profile - NO SERIALIZERS"""
        try:
            print(f"[UPDATE] Called with data: {request.data}")
            print(f"[UPDATE] Files: {request.FILES}")
            print(f"[UPDATE] FILES keys: {list(request.FILES.keys())}")
            print(f"[UPDATE] DATA keys: {list(request.data.keys())}")
            
            # Get or create profile
            try:
                profile = UserProfile.objects.get(user=request.user)
                print(f"[UPDATE] Found existing profile: {profile.id}")
            except UserProfile.DoesNotExist:
                print(f"[UPDATE] Creating new profile")
                profile = UserProfile.objects.create(user=request.user)
            
            # Update User model fields directly (NO SERIALIZER)
            if 'bio' in request.data:
                request.user.bio = request.data['bio']
                print(f"[UPDATE] Setting bio: {request.data['bio']}")
            
            if 'phone_number' in request.data:
                request.user.phone_number = request.data['phone_number']
                print(f"[UPDATE] Setting phone_number: {request.data['phone_number']}")
            
            if 'first_name' in request.data:
                request.user.first_name = request.data['first_name']
                print(f"[UPDATE] Setting first_name: {request.data['first_name']}")
            
            if 'last_name' in request.data:
                request.user.last_name = request.data['last_name']
                print(f"[UPDATE] Setting last_name: {request.data['last_name']}")
            
            if 'email' in request.data:
                request.user.email = request.data['email']
                print(f"[UPDATE] Setting email: {request.data['email']}")
            
            # Handle profile image upload - MANUALLY SAVE THE FILE
            if 'profile_image' in request.FILES:
                import os
                from django.core.files.base import ContentFile
                import uuid
                
                file_obj = request.FILES['profile_image']
                print(f"[UPDATE] ✅ Profile image file received!")
                print(f"[UPDATE]    - Filename: {file_obj.name}")
                print(f"[UPDATE]    - Size: {file_obj.size} bytes")
                print(f"[UPDATE]    - Content Type: {file_obj.content_type}")
                
                # Read file content
                file_content = file_obj.read()
                print(f"[UPDATE]    - Read {len(file_content)} bytes from file")
                
                # Generate unique filename to avoid conflicts
                ext = os.path.splitext(file_obj.name)[1]  # Get file extension
                filename = f"profile_{request.user.id}_{uuid.uuid4().hex[:8]}{ext}"
                print(f"[UPDATE]    - Generated filename: {filename}")
                
                # Create the full file path
                media_dir = os.path.join(settings.MEDIA_ROOT, 'user_profiles')
                os.makedirs(media_dir, exist_ok=True)
                full_path = os.path.join(media_dir, filename)
                print(f"[UPDATE]    - Full file path: {full_path}")
                
                # Write file to disk
                try:
                    with open(full_path, 'wb') as f:
                        f.write(file_content)
                    print(f"[UPDATE]    ✅ File written to disk successfully!")
                    print(f"[UPDATE]    - File size on disk: {os.path.getsize(full_path)} bytes")
                    
                    # Update model with relative path (for Django media)
                    relative_path = f'user_profiles/{filename}'
                    request.user.profile_image = relative_path
                    print(f"[UPDATE]    - Model field set to: {relative_path}")
                except Exception as e:
                    print(f"[UPDATE]    ❌ ERROR writing file: {str(e)}")
                    raise
            else:
                print(f"[UPDATE] ℹ️ No profile_image in request.FILES")
            
            # Save user
            request.user.save()
            print(f"[UPDATE] ✅ User saved to database")
            print(f"[UPDATE]    - profile_image field value: {request.user.profile_image}")
            
            # Verify file was saved to disk
            if request.user.profile_image:
                import os
                file_path = os.path.join(settings.MEDIA_ROOT, str(request.user.profile_image))
                print(f"[UPDATE] 📁 Verifying file on disk:")
                print(f"[UPDATE]    - Expected path: {file_path}")
                print(f"[UPDATE]    - File exists: {os.path.exists(file_path)}")
                if os.path.exists(file_path):
                    size = os.path.getsize(file_path)
                    print(f"[UPDATE]    - File size: {size} bytes ✅")
                else:
                    print(f"[UPDATE]    - ⚠️ FILE NOT FOUND ON DISK!")
            else:
                print(f"[UPDATE] ⚠️ profile_image is None after save")
            
            # Update UserProfile fields directly (NO SERIALIZER)
            if 'company' in request.data:
                profile.company = request.data['company']
                print(f"[UPDATE] Setting company: {request.data['company']}")
            
            if 'location' in request.data:
                profile.location = request.data['location']
                print(f"[UPDATE] Setting location: {request.data['location']}")
            
            if 'website' in request.data:
                profile.website = request.data['website']
                print(f"[UPDATE] Setting website: {request.data['website']}")
            
            # Save profile
            profile.save()
            print(f"[UPDATE] Profile saved successfully")
            
            # Return updated data
            profile_image_url = None
            if request.user.profile_image:
                # Build full absolute URL for the image
                relative_url = request.user.profile_image.url
                profile_image_url = request.build_absolute_uri(relative_url)
                print(f"[UPDATE] Profile image URL: {profile_image_url}")
            data = {
                'id': profile.id,
                'company': profile.company,
                'location': profile.location,
                'website': profile.website,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'bio': request.user.bio,
                    'phone_number': request.user.phone_number,
                    'profile_image': profile_image_url,
                }
            }
            
            print(f"[UPDATE] Returning updated data: {data}")
            return Response(data, status=status.HTTP_200_OK)
            
        except Exception as e:
            import traceback
            print(f"[ERROR] UPDATE /profiles/me/: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {'detail': f'Error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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
