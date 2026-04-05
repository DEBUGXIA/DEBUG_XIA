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
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(password=password, **validated_data)
        UserProfile.objects.create(user=user)
        return user


class SignInSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials.")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials.")

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
