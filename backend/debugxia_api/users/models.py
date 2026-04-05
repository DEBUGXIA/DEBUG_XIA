from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    """
    Custom User model with comprehensive user information
    """
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_image = models.ImageField(upload_to='user_profiles/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    
    # Additional user information
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=20, 
        choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other'), ('prefer_not', 'Prefer not to say')],
        blank=True, 
        null=True
    )
    
    # Account status
    is_email_verified = models.BooleanField(default=False)
    is_active_account = models.BooleanField(default=True)
    account_verified_at = models.DateTimeField(blank=True, null=True)
    
    # Preferences
    notification_email = models.BooleanField(default=True)
    notification_sms = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_date = models.DateTimeField(blank=True, null=True)
    last_login_ip = models.GenericIPAddressField(blank=True, null=True)
    
    # Override groups and user_permissions with custom related_name
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
    Extended user profile with comprehensive personal and professional information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Professional Information
    company = models.CharField(max_length=255, blank=True, null=True)
    job_title = models.CharField(max_length=255, blank=True, null=True)
    industry = models.CharField(max_length=255, blank=True, null=True)
    years_of_experience = models.IntegerField(blank=True, null=True)
    
    # Location Information
    location = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    timezone = models.CharField(max_length=50, blank=True, null=True)
    
    # Links and URLs
    website = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    
    # Skills and Interests
    skills = models.JSONField(default=list, help_text="List of skills")
    languages = models.JSONField(default=list, help_text="Languages spoken")
    interests = models.JSONField(default=list, help_text="User interests")
    
    # Account Information
    profile_completion_percentage = models.IntegerField(default=0)
    profile_visibility = models.CharField(
        max_length=20,
        choices=[('public', 'Public'), ('private', 'Private'), ('friends', 'Friends Only')],
        default='private'
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.user.email} - Profile"


class LoginHistory(models.Model):
    """
    Track all user login attempts and successful logins
    """
    LOGIN_STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('locked', 'Account Locked'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_history')
    status = models.CharField(max_length=20, choices=LOGIN_STATUS_CHOICES, default='success')
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True, null=True)
    device_type = models.CharField(max_length=50, blank=True, null=True)
    browser = models.CharField(max_length=100, blank=True, null=True)
    os = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    failed_reason = models.TextField(blank=True, null=True)
    login_timestamp = models.DateTimeField(auto_now_add=True)
    logout_timestamp = models.DateTimeField(blank=True, null=True)
    session_duration = models.IntegerField(blank=True, null=True, help_text="Duration in seconds")

    class Meta:
        ordering = ['-login_timestamp']
        verbose_name = 'Login History'
        verbose_name_plural = 'Login Histories'
        indexes = [
            models.Index(fields=['user', '-login_timestamp']),
            models.Index(fields=['status', '-login_timestamp']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.status} at {self.login_timestamp}"



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
