from django.contrib import admin
from debugxia_api.users.models import User, UserProfile, LoginHistory, ErrorLog, CodeExecution, AnalysisHistory


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'is_email_verified', 'last_login_date', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    list_filter = ['is_email_verified', 'gender', 'is_active_account', 'created_at']
    ordering = ['-created_at']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'company', 'job_title', 'location', 'updated_at']
    search_fields = ['user__email', 'company', 'job_title', 'location']
    ordering = ['-updated_at']


@admin.register(LoginHistory)
class LoginHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'status', 'ip_address', 'device_type', 'browser', 'login_timestamp']
    search_fields = ['user__email', 'ip_address', 'location']
    list_filter = ['status', 'device_type', 'browser', 'login_timestamp']
    ordering = ['-login_timestamp']
    readonly_fields = ['login_timestamp']


@admin.register(ErrorLog)
class ErrorLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'error_type', 'severity', 'status', 'created_at']
    search_fields = ['user__email', 'error_type', 'error_message']
    list_filter = ['severity', 'status', 'created_at']
    ordering = ['-created_at']


@admin.register(CodeExecution)
class CodeExecutionAdmin(admin.ModelAdmin):
    list_display = ['user', 'language', 'success', 'execution_time', 'created_at']
    search_fields = ['user__email', 'language', 'code']
    list_filter = ['language', 'success', 'created_at']
    ordering = ['-created_at']


@admin.register(AnalysisHistory)
class AnalysisHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'analysis_type', 'score', 'created_at']
    search_fields = ['user__email', 'analysis_type', 'suggestions']
    list_filter = ['analysis_type', 'created_at']
    ordering = ['-created_at']

