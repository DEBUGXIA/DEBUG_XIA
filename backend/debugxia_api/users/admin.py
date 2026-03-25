from django.contrib import admin
from debugxia_api.users.models import User, UserProfile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'is_email_verified', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    list_filter = ['is_email_verified', 'created_at', 'updated_at']
    ordering = ['-created_at']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'company', 'location', 'last_login_timestamp']
    search_fields = ['user__email', 'company', 'location']
    ordering = ['-last_login_timestamp']
