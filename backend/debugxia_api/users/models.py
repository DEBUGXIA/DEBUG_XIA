from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    """
    Custom User model with additional fields for signup and profile management
    """
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_image = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Override groups and user_permissions with custom related_name to avoid clashes
    groups = models.ManyToManyField(
        Group,
        blank=True,
        related_name='debugxia_user_set',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        blank=True,
        related_name='debugxia_user_set_permissions',
        verbose_name='user permissions'
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    """
    Extended user profile for additional information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    company = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    last_login_ip = models.GenericIPAddressField(blank=True, null=True)
    last_login_timestamp = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.user.email} - Profile"


class ErrorLog(models.Model):
    """
    Error logging model for tracking user code errors
    """
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    STATUS_CHOICES = [
        ('unresolved', 'Unresolved'),
        ('resolved', 'Resolved'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='error_logs')
    error_type = models.CharField(max_length=255)
    error_message = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unresolved')
    file_path = models.CharField(max_length=500, blank=True, null=True)
    line_number = models.IntegerField(blank=True, null=True)
    code_snippet = models.TextField(blank=True, null=True)
    ai_suggestion = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Error Log'
        verbose_name_plural = 'Error Logs'

    def __str__(self):
        return f"{self.user.email} - {self.error_type}"


class CodeExecution(models.Model):
    """
    Track code executions for terminal and analysis
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='code_executions')
    language = models.CharField(max_length=50)  # python, javascript, cpp, etc.
    code = models.TextField()
    output = models.TextField(blank=True, null=True)
    execution_time = models.FloatField(blank=True, null=True)
    success = models.BooleanField(default=False)
    error = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Code Execution'
        verbose_name_plural = 'Code Executions'

    def __str__(self):
        return f"{self.user.email} - {self.language}"


class AnalysisHistory(models.Model):
    """
    Store code analysis and optimization history
    """
    ANALYSIS_TYPE_CHOICES = [
        ('optimization', 'Optimization'),
        ('quality', 'Quality Analysis'),
        ('performance', 'Performance Analysis'),
        ('security', 'Security Analysis'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analysis_history')
    analysis_type = models.CharField(max_length=50, choices=ANALYSIS_TYPE_CHOICES)
    code = models.TextField()
    suggestions = models.TextField()
    score = models.FloatField(default=0.0)
    improvements = models.JSONField(default=dict)  # Store as JSON for flexibility
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Analysis History'
        verbose_name_plural = 'Analysis Histories'

    def __str__(self):
        return f"{self.user.email} - {self.analysis_type}"
