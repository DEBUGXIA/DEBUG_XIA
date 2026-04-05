from rest_framework import serializers
from django.contrib.auth import authenticate
from debugxia_api.users.models import User, UserProfile, ErrorLog, CodeExecution, AnalysisHistory


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'phone_number', 'profile_image', 'bio', 'is_email_verified', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_email_verified']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'company', 'location', 'website', 
                  'last_login_ip', 'last_login_timestamp']
        read_only_fields = ['id', 'last_login_ip', 'last_login_timestamp']


class SignUpSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True,min_length=5)
    password_confirm = serializers.CharField(write_only=True, min_length=5)

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords must match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(password=password, **validated_data)
        UserProfile.objects.create(user=user)
        return user


class SignInSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.CharField()  # Accept email or username
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email_or_username = data.get('email', '').strip()
        password = data.get('password', '')

        if not email_or_username or not password:
            raise serializers.ValidationError("Email/username and password are required.")

        user = None
        
        # Try email first (case-insensitive)
        if '@' in email_or_username:
            try:
                user = User.objects.get(email__iexact=email_or_username)
            except User.DoesNotExist:
                pass
        
        # If not found by email, try username
        if not user:
            try:
                user = User.objects.get(username__iexact=email_or_username)
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid email/username or password.")

        # Verify password
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email/username or password.")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        data['user'] = user
        return data


class ErrorLogSerializer(serializers.ModelSerializer):
    """Serializer for ErrorLog model"""
    class Meta:
        model = ErrorLog
        fields = ['id', 'error_type', 'error_message', 'severity', 'status', 
                  'file_path', 'line_number', 'code_snippet', 'ai_suggestion', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CodeExecutionSerializer(serializers.ModelSerializer):
    """Serializer for CodeExecution model"""
    class Meta:
        model = CodeExecution
        fields = ['id', 'language', 'code', 'output', 'execution_time', 'success', 'error', 'created_at']
        read_only_fields = ['id', 'created_at', 'output', 'execution_time', 'success', 'error']


class AnalysisHistorySerializer(serializers.ModelSerializer):
    """Serializer for AnalysisHistory model"""
    class Meta:
        model = AnalysisHistory
        fields = ['id', 'analysis_type', 'code', 'suggestions', 'score', 'improvements', 'created_at']
        read_only_fields = ['id', 'created_at', 'suggestions', 'score', 'improvements']
