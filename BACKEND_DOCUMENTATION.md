# DEBUG_XIA Backend Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Core Configuration](#core-configuration)
4. [Database Models](#database-models)
5. [API Serializers](#api-serializers)
6. [API Endpoints](#api-endpoints)
7. [Views & ViewSets](#views--viewsets)
8. [Utility Modules](#utility-modules)
9. [Installation & Setup](#installation--setup)

---

## Project Overview

**DEBUG_XIA** is a Django REST Framework-based backend API designed to provide code analysis, execution, and debugging capabilities. The API supports multiple programming languages (Python, Java, C, C++) and integrates with the Ollama Mistral AI model for intelligent code analysis.

### Technology Stack
- **Framework**: Django 4.2.10
- **REST API**: Django REST Framework 3.14.0
- **Authentication**: JWT (djangorestframework-simplejwt 5.3.1)
- **CORS**: django-cors-headers
- **AI Integration**: Ollama Mistral
- **Database**: SQLite (default)
- **Image Processing**: Pillow

---

## Project Structure

```
backend/
├── debugxia_api/                 # Main Django app
│   ├── __init__.py
│   ├── debug_views.py           # Code analysis & execution views
│   ├── core/                    # Core configuration
│   │   ├── __init__.py
│   │   ├── asgi.py             # ASGI configuration
│   │   ├── wsgi.py             # WSGI configuration
│   │   ├── settings.py         # Django settings
│   │   ├── urls.py             # URL routing
│   │   ├── utils.py            # Utility functions
│   │   └── authentication.py   # Custom authentication
│   └── users/                  # User management app
│       ├── __init__.py
│       ├── admin.py            # Django admin configuration
│       ├── apps.py             # App configuration
│       ├── models.py           # Database models
│       ├── serializers.py      # DRF serializers
│       ├── views.py            # ViewSets and API views
│       ├── management/         # Custom management commands
│       │   └── commands/
│       │       ├── create_demo_user.py
│       │       └── setup_users.py
│       └── migrations/         # Database migrations
├── db.sqlite3                  # SQLite database
├── manage.py                   # Django management script
├── requirements.txt            # Python dependencies
└── README.md
```

---

## Core Configuration

### settings.py
Location: `debugxia_api/core/settings.py`

Configures Django application with:
- **Installed Apps**: Django core, DRF, CORS, django-filters, users app
- **Middleware**: Security, sessions, CORS, CSRF protection, authentication
- **Database**: SQLite by default (configurable via environment variables)
- **Authentication**: JWT via djangorestframework-simplejwt
- **CORS Configuration**: Allows cross-origin requests
- **Static/Media Files**: Configuration for serving user-uploaded files

### urls.py
Location: `debugxia_api/core/urls.py`

Main URL router that defines all API endpoints:
- JWT token endpoints (obtain, refresh, verify)
- User profile routes
- Code analysis routes
- ViewSet routes with DefaultRouter

### authentication.py
Location: `debugxia_api/core/authentication.py`

**CustomJWTAuthentication Class**
- Extends: `JWTAuthentication`
- Custom JWT authentication with error handling
- Validates JWT tokens and attaches user to request object

### utils.py
Location: `debugxia_api/core/utils.py`

**APIResponse Class** - Helper for consistent API responses
- `success(message, data, status_code)`: Returns success response with data
- `error(message, errors, status_code)`: Returns error response with error details

---

## Database Models

### User Model
Location: `debugxia_api/users/models.py`

Extended Django AbstractUser model with comprehensive user information.

**Fields:**
- `email` (EmailField, unique): User email address
- `phone_number` (CharField): Contact phone number
- `profile_image` (ImageField): User profile picture
- `bio` (TextField): User biography
- `date_of_birth` (DateField): Birth date
- `gender` (CharField): Gender choice (male, female, other, prefer_not)
- `is_email_verified` (BooleanField): Email verification status
- `is_active_account` (BooleanField): Account active status
- `account_verified_at` (DateTimeField): Verification timestamp
- `notification_email` (BooleanField): Email notification preference
- `notification_sms` (BooleanField): SMS notification preference
- `created_at` (DateTimeField): Account creation time
- `updated_at` (DateTimeField): Last update time
- `last_login_date` (DateTimeField): Last login timestamp
- `last_login_ip` (GenericIPAddressField): Last login IP address

**Methods:**
- `__str__()`: Returns user email

---

### UserProfile Model
Location: `debugxia_api/users/models.py`

Extended profile information linked 1:1 to User model.

**Professional Information:**
- `company` (CharField): Company name
- `job_title` (CharField): Job title
- `industry` (CharField): Industry field
- `years_of_experience` (IntegerField): Years in industry

**Location Information:**
- `location` (CharField): Location/city
- `country` (CharField): Country name
- `city` (CharField): City name
- `timezone` (CharField): User timezone

**Links & URLs:**
- `website` (URLField): Personal website
- `github_url` (URLField): GitHub profile link
- `linkedin_url` (URLField): LinkedIn profile link
- `twitter_url` (URLField): Twitter profile link
- `portfolio_url` (URLField): Portfolio website link

**Skills & Interests:**
- `skills` (JSONField): List of user skills
- `languages` (JSONField): Languages spoken
- `interests` (JSONField): User interests

**Account Information:**
- `profile_completion_percentage` (IntegerField): Profile completion %
- `profile_visibility` (CharField): Visibility setting (public, private, friends_only)
- `created_at` (DateTimeField): Profile creation time
- `updated_at` (DateTimeField): Last update time

---

### LoginHistory Model
Location: `debugxia_api/users/models.py`

Tracks all user login attempts and sessions.

**Fields:**
- `user` (ForeignKey): Reference to User
- `status` (CharField): Login status (success, failed, locked)
- `ip_address` (GenericIPAddressField): Login IP address
- `user_agent` (TextField): Browser user agent string
- `device_type` (CharField): Device type (mobile, desktop, etc.)
- `browser` (CharField): Browser name/version
- `os` (CharField): Operating system
- `location` (CharField): Geographic location
- `failed_reason` (TextField): Reason for failed login
- `login_timestamp` (DateTimeField): Login time
- `logout_timestamp` (DateTimeField): Logout time
- `session_duration` (IntegerField): Session duration in seconds

**Indexes:**
- Composite index on (user, -login_timestamp)
- Composite index on (status, -login_timestamp)

---

### ErrorLog Model
Location: `debugxia_api/users/models.py`

Tracks code errors and debugging information for users.

**Fields:**
- `user` (ForeignKey): Reference to User
- `error_type` (CharField): Type of error
- `error_message` (TextField): Full error message
- `severity` (CharField): Severity level (low, medium, high, critical)
- `status` (CharField): Resolution status (unresolved, resolved)
- `file_path` (CharField): Source file path
- `line_number` (IntegerField): Error line number
- `code_snippet` (TextField): Code where error occurred
- `ai_suggestion` (TextField): AI-generated fix suggestion
- `created_at` (DateTimeField): Error timestamp
- `updated_at` (DateTimeField): Last update time

---

### CodeExecution Model
Location: `debugxia_api/users/models.py`

Records all code execution attempts and results.

**Fields:**
- `user` (ForeignKey): Reference to User
- `language` (CharField): Programming language (Python, Java, C, C++, etc.)
- `code` (TextField): Source code executed
- `output` (TextField): Program output
- `execution_time` (FloatField): Execution duration in seconds
- `success` (BooleanField): Whether execution succeeded
- `error` (TextField): Error message if execution failed
- `created_at` (DateTimeField): Execution timestamp

---

### AnalysisHistory Model
Location: `debugxia_api/users/models.py`

Stores code analysis results and AI suggestions.

**Fields:**
- `user` (ForeignKey): Reference to User
- `analysis_type` (CharField): Type of analysis (optimization, quality, performance, security)
- `file_name` (CharField): Original file name analyzed
- `language` (CharField): Programming language
- `code` (TextField): Source code analyzed
- `suggestions` (TextField): Analysis suggestions from AI
- `score` (FloatField): Quality score (0-100)
- `improvements` (JSONField): Structured improvement suggestions
- `created_at` (DateTimeField): Analysis timestamp

---

### ExecutionStats Model
Location: `debugxia_api/users/models.py`

Aggregated statistics for user code executions.

**Fields:**
- `user` (OneToOneField): Reference to User (1:1 relationship)
- `total_executions` (IntegerField): Total code executions
- `successful_executions` (IntegerField): Successful executions
- `failed_executions` (IntegerField): Failed executions
- `total_execution_time` (FloatField): Total time in seconds
- `average_execution_time` (FloatField): Average execution time
- `languages_used` (JSONField): Dictionary of language usage counts
- `last_execution_date` (DateTimeField): Last execution timestamp
- `created_at` (DateTimeField): Stats creation time
- `updated_at` (DateTimeField): Last update time

**Methods:**
- `update_stats(success, execution_time, language)`: Updates statistics after code execution
- `get_success_rate()`: Returns success rate percentage

---

## API Serializers

### UserSerializer
Location: `debugxia_api/users/serializers.py`

Serializes User model for API responses.

**Fields:**
- id, username, email, first_name, last_name
- phone_number, profile_image, bio, date_of_birth, gender
- is_email_verified, is_active_account, account_verified_at
- notification_email, notification_sms
- created_at, updated_at, last_login_date, last_login_ip

**Read-only Fields:** id, created_at, updated_at, is_email_verified, last_login_date, last_login_ip

---

### UserProfileSerializer
Location: `debugxia_api/users/serializers.py`

Serializes UserProfile model with nested User data.

**Fields:**
- Profile: id, company, job_title, industry, years_of_experience
- Location: location, country, city, timezone
- Links: website, github_url, linkedin_url, twitter_url, portfolio_url
- Skills: skills, languages, interests
- Settings: profile_completion_percentage, profile_visibility
- Metadata: created_at, updated_at, user (nested serialized)

---

### SignUpSerializer
Location: `debugxia_api/users/serializers.py`

Handles user registration validation and creation.

**Fields:**
- email (unique validation)
- username (unique validation)
- first_name, last_name
- password, password_confirm (write-only)

**Validation:**
- Validates email uniqueness (case-insensitive)
- Validates username uniqueness (case-insensitive)
- Validates password confirmation match
- Creates User and UserProfile on success

---

### SignInSerializer
Location: `debugxia_api/users/serializers.py`

Handles user login validation.

**Fields:**
- email (accepts email or username)
- password (write-only)

**Validation:**
- Accepts both email and username for login
- Case-insensitive username/email lookup
- Validates password against stored hash
- Checks account active status

---

### ErrorLogSerializer
Location: `debugxia_api/users/serializers.py`

Serializes ErrorLog model for API responses.

**Fields:**
- id, error_type, error_message, severity, status
- file_path, line_number, code_snippet, ai_suggestion
- created_at, updated_at

**Read-only Fields:** id, created_at, updated_at

---

### CodeExecutionSerializer
Location: `debugxia_api/users/serializers.py`

Serializes CodeExecution model.

**Fields:**
- id, language, code, output, execution_time, success, error, created_at

**Read-only Fields:** id, created_at, output, execution_time, success, error

---

### AnalysisHistorySerializer
Location: `debugxia_api/users/serializers.py`

Serializes AnalysisHistory model.

**Fields:**
- id, analysis_type, code, suggestions, score, improvements, created_at

**Read-only Fields:** id, created_at, suggestions, score, improvements

---

### LoginHistorySerializer
Location: `debugxia_api/users/serializers.py`

Serializes LoginHistory model.

**Fields:**
- id, user, user_email (read-only), status, ip_address, user_agent
- device_type, browser, os, location, failed_reason
- login_timestamp, logout_timestamp, session_duration

**Read-only Fields:** id, login_timestamp

---

## API Endpoints

### JWT Authentication Endpoints

#### Obtain Token
- **URL**: `/token/`
- **Method**: POST
- **Description**: Obtain JWT access and refresh tokens
- **Request Body**: `{ "username": "...", "password": "..." }`
- **Response**: Access token, refresh token

#### Refresh Token
- **URL**: `/token/refresh/`
- **Method**: POST
- **Description**: Refresh expired access token
- **Request Body**: `{ "refresh": "..." }`
- **Response**: New access token

#### Verify Token
- **URL**: `/token/verify/`
- **Method**: POST
- **Description**: Verify JWT token validity
- **Request Body**: `{ "token": "..." }`
- **Response**: Token verification status

---

### User Authentication Endpoints

#### User Signup
- **URL**: `/api/users/signup/`
- **Method**: POST
- **Permission**: AllowAny
- **Description**: Register new user account
- **Request Body**: 
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "first_name": "John",
    "last_name": "Doe",
    "password": "password123",
    "password_confirm": "password123"
  }
  ```
- **Response**: User data, access/refresh tokens

#### User Signin
- **URL**: `/api/users/signin/`
- **Method**: POST
- **Permission**: AllowAny
- **Description**: User login
- **Request Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User data, access/refresh tokens

#### Get Current User
- **URL**: `/api/users/me/`
- **Method**: GET
- **Permission**: IsAuthenticated
- **Description**: Retrieve current user information
- **Response**: User object with full profile image URL

#### Update User Profile
- **URL**: `/api/users/update_profile/`
- **Method**: PUT
- **Permission**: IsAuthenticated
- **Description**: Update user profile information (bio, phone, name, email)
- **Request Body**: Partial user fields
- **Response**: Updated user object

#### User Logout
- **URL**: `/api/users/logout/`
- **Method**: POST
- **Permission**: IsAuthenticated
- **Description**: Logout endpoint (client should delete token)
- **Response**: Success message

---

### User Profile Endpoints

#### Get User Profile
- **URL**: `/api/profiles/me/`
- **Method**: GET
- **Permission**: IsAuthenticated
- **Description**: Get current user's extended profile
- **Response**:
  ```json
  {
    "id": 1,
    "company": "...",
    "location": "...",
    "website": "...",
    "user": { ... }
  }
  ```

#### Update User Profile
- **URL**: `/api/profiles/me/`
- **Method**: PUT/PATCH
- **Permission**: IsAuthenticated
- **Description**: Update profile information and upload profile image
- **Request Body** (multipart/form-data):
  ```json
  {
    "bio": "...",
    "phone_number": "...",
    "first_name": "...",
    "last_name": "...",
    "email": "...",
    "company": "...",
    "location": "...",
    "website": "...",
    "profile_image": <file>
  }
  ```
- **Response**: Updated profile data

---

### Code Analysis Endpoints

#### Analyze Code
- **URL**: `/api/analyze-code/`
- **Method**: POST
- **Permission**: AllowAny
- **Description**: Analyze code using Ollama Mistral AI
- **Request Body**:
  ```json
  {
    "code": "print('hello')",
    "language": "Python"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "analysis": "AI analysis text..."
  }
  ```
- **Requires**: Ollama with Mistral model running

#### Execute Code
- **URL**: `/api/execute-code/`
- **Method**: POST
- **Permission**: AllowAny
- **Description**: Execute code and return output
- **Request Body**:
  ```json
  {
    "code": "print('hello')",
    "language": "Python"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "output": "hello",
    "error": ""
  }
  ```
- **Supported Languages**: Python, Java, C, C++
- **Features**: 
  - Timeout protection (10 seconds)
  - Temporary file cleanup
  - Java compilation support
  - C/C++ compilation support
  - Cross-platform executable handling

#### Analyze Execution
- **URL**: `/api/analyze-execution/`
- **Method**: POST
- **Permission**: AllowAny
- **Description**: Analyze code execution results
- **Request Body**:
  ```json
  {
    "code": "print('hello')",
    "language": "Python",
    "output": "hello",
    "error": "",
    "file_name": "test.py",
    "analysis_type": "quality"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "analysis": "AI analysis of execution..."
  }
  ```
- **Features**: Saves analysis history if user authenticated

#### Execution Statistics
- **URL**: `/api/execution-stats/`
- **Method**: GET/POST
- **Permission**: IsAuthenticated
- **GET Description**: Retrieve execution statistics for current user
- **GET Response**:
  ```json
  {
    "stats": {
      "total_executions": 10,
      "successful_executions": 8,
      "failed_executions": 2,
      "average_execution_time": 0.45,
      "success_rate": 80,
      "languages_used": { "Python": 5, "Java": 3 },
      "last_execution_date": "2024-04-07T10:30:00Z"
    }
  }
  ```
- **POST Description**: Update execution statistics
- **POST Request Body**:
  ```json
  {
    "success": true,
    "execution_time": 0.5,
    "language": "Python"
  }
  ```

---

### Error Log Endpoints

#### List Error Logs
- **URL**: `/api/errors/`
- **Method**: GET
- **Permission**: IsAuthenticated
- **Description**: List error logs for current user
- **Query Parameters**:
  - `severity`: Filter by severity (low, medium, high, critical)
  - `status`: Filter by status (unresolved, resolved)
  - `error_type`: Filter by error type
  - `search`: Search in error message/file path
  - `ordering`: Order by created_at or severity

#### Create Error Log
- **URL**: `/api/errors/`
- **Method**: POST
- **Permission**: IsAuthenticated
- **Request Body**:
  ```json
  {
    "error_type": "SyntaxError",
    "error_message": "Invalid syntax...",
    "severity": "high",
    "file_path": "script.py",
    "line_number": 42,
    "code_snippet": "invalid code..."
  }
  ```

#### Error Statistics
- **URL**: `/api/errors/statistics/`
- **Method**: GET
- **Permission**: IsAuthenticated
- **Response**:
  ```json
  {
    "total_errors": 10,
    "resolved": 3,
    "unresolved": 7,
    "by_severity": {
      "low": 2,
      "medium": 5,
      "high": 2,
      "critical": 1
    }
  }
  ```

#### Mark Error as Resolved
- **URL**: `/api/errors/{id}/mark_resolved/`
- **Method**: PUT
- **Permission**: IsAuthenticated
- **Response**: Updated error object

---

### Code Execution Endpoints

#### List Code Executions
- **URL**: `/api/executions/`
- **Method**: GET
- **Permission**: IsAuthenticated
- **Description**: List code executions for current user
- **Query Parameters**:
  - `language`: Filter by language
  - `success`: Filter by success (true/false)
  - `ordering`: Order by created_at or execution_time

#### Create Code Execution
- **URL**: `/api/executions/`
- **Method**: POST
- **Permission**: IsAuthenticated
- **Request Body**:
  ```json
  {
    "language": "Python",
    "code": "print('hello')"
  }
  ```

#### Execution Statistics
- **URL**: `/api/executions/statistics/`
- **Method**: GET
- **Permission**: IsAuthenticated
- **Response**:
  ```json
  {
    "total_executions": 10,
    "successful": 8,
    "failed": 2,
    "success_rate": 80.0,
    "avg_execution_time": 0.45
  }
  ```

---

### Analysis History Endpoints

#### List Analysis History
- **URL**: `/api/analysis/`
- **Method**: GET
- **Permission**: IsAuthenticated
- **Description**: List code analysis history for current user
- **Query Parameters**:
  - `analysis_type`: Filter by type (optimization, quality, performance, security)
  - `search`: Search in suggestions
  - `ordering`: Order by created_at or score

#### Create Analysis History
- **URL**: `/api/analysis/`
- **Method**: POST
- **Permission**: IsAuthenticated
- **Request Body**:
  ```json
  {
    "analysis_type": "quality",
    "code": "your code here",
    "suggestions": "analysis suggestions..."
  }
  ```

---

## Views & ViewSets

### UserViewSet
Location: `debugxia_api/users/views.py`

Extends: `viewsets.ModelViewSet`

**Default Actions:**
- `list`: Get all users (authenticated)
- `create`: Create new user
- `retrieve`: Get user by ID
- `update`: Update user (authenticated)
- `destroy`: Delete user (authenticated)

**Custom Actions:**

#### signup (POST)
- **Auth**: AllowAny
- **Description**: User registration
- **Process**:
  1. Validates email/username uniqueness
  2. Validates password confirmation
  3. Creates User and UserProfile
  4. Returns JWT tokens

#### signin (POST)
- **Auth**: AllowAny
- **Description**: User login
- **Process**:
  1. Accepts email or username
  2. Validates password
  3. Returns JWT tokens
  4. Handles errors gracefully

#### me (GET)
- **Auth**: IsAuthenticated
- **Description**: Get current user with absolute profile image URL
- **Implementation**: Converts relative image paths to absolute URLs

#### logout (POST)
- **Auth**: IsAuthenticated
- **Description**: Logout (client deletes token)

#### update_profile (PUT)
- **Auth**: IsAuthenticated
- **Description**: Update user profile information

---

### UserProfileView
Location: `debugxia_api/users/views.py`

Extends: `APIView`

**GET Method**
- **Auth**: IsAuthenticated
- **Description**: Get current user's extended profile
- **Features**:
  - Creates profile if doesn't exist
  - Builds full absolute URLs for images
  - Returns nested user data

**PUT/PATCH Methods**
- **Auth**: IsAuthenticated
- **Description**: Update user and profile information
- **Features**:
  - Updates User fields (bio, phone, name, email)
  - Updates UserProfile fields (company, location, website)
  - **Profile Image Upload**:
    - Generates unique filename with UUID
    - Validates file size and type
    - Saves file to disk
    - Stores relative path in database
    - Returns absolute URL to client
  - Comprehensive logging for debugging
  - File integrity verification

---

### ErrorLogViewSet
Location: `debugxia_api/users/views.py`

Extends: `viewsets.ModelViewSet`

**Permissions**: IsAuthenticated

**Filtering**:
- By severity: low, medium, high, critical
- By status: unresolved, resolved
- By error_type
- By search: error_message, file_path

**Ordering**: -created_at, severity

**Methods**:
- `get_queryset()`: Returns errors for current user only
- `perform_create()`: Associates error with current user

**Custom Actions**:

#### statistics (GET)
- Returns aggregated error statistics:
  ```json
  {
    "total_errors": 10,
    "resolved": 3,
    "unresolved": 7,
    "by_severity": { "low": 2, "medium": 5, "high": 2, "critical": 1 }
  }
  ```

#### mark_resolved (PUT)
- Updates error status to 'resolved'

---

### CodeExecutionViewSet
Location: `debugxia_api/users/views.py`

Extends: `viewsets.ModelViewSet`

**Permissions**: IsAuthenticated

**Filtering**:
- By language (Python, Java, C, C++, etc.)
- By success (True/False)

**Ordering**: -created_at, execution_time

**Methods**:
- `get_queryset()`: Returns executions for current user only
- `perform_create()`: Associates execution with current user

**Custom Actions**:

#### statistics (GET)
- Returns aggregated execution statistics:
  ```json
  {
    "total_executions": 10,
    "successful": 8,
    "failed": 2,
    "success_rate": 80.0,
    "avg_execution_time": 0.45
  }
  ```

---

### AnalysisHistoryViewSet
Location: `debugxia_api/users/views.py`

Extends: `viewsets.ModelViewSet`

**Permissions**: IsAuthenticated

**Filtering**:
- By analysis_type: optimization, quality, performance, security
- By search: Suggestions field
- By ordering: -created_at, score

**Methods**:
- `get_queryset()`: Returns analyses for current user only
- `perform_create()`: Associates analysis with current user

---

## Debug Views Functions

Location: `debugxia_api/debug_views.py`

### debug_token (GET)
- **Auth**: AllowAny
- **Description**: Debug endpoint to check token and authentication
- **Response**: Auth header, user info, authentication status

### debug_protected (GET)
- **Auth**: IsAuthenticated
- **Description**: Protected endpoint for testing JWT authentication
- **Response**: User ID, email, authentication status

### analyze_code (POST)
- **Auth**: AllowAny
- **Description**: Analyze code using Ollama Mistral AI
- **Request**:
  ```json
  {
    "code": "source code",
    "language": "Python"
  }
  ```
- **Process**:
  1. Validates code provided
  2. Sends to Ollama Mistral API
  3. Receives comprehensive analysis (errors, improvements, best practices)
  4. Returns AI analysis
- **Timeout**: 600 seconds
- **Requires**: Ollama running with Mistral model

### execute_code (POST)
- **Auth**: AllowAny
- **Description**: Execute code and return output/errors
- **Request**:
  ```json
  {
    "code": "source code",
    "language": "Python"
  }
  ```
- **Supported Languages**:
  - **Python**: Direct execution with sys.executable
  - **Java**: Compilation with javac, execution with java
  - **C/C++**: Compilation with gcc/g++, execution of binary
- **Process**:
  1. Creates temporary file with code
  2. Executes based on language
  3. Captures stdout/stderr
  4. Cleans up temp files
  5. Returns execution results
- **Features**:
  - 10-second timeout per execution
  - Cross-platform executable handling (Windows/Unix)
  - Compiler availability fallback
  - Automatic cleanup

### get_file_extension (Helper)
- **Description**: Maps language names to file extensions
- **Returns**: .py, .java, .c, .cpp, .txt

### analyze_code_with_mistral (Helper)
- **Description**: Analyze code when execution isn't possible
- **Used by**: execute_code as fallback when compiler unavailable
- **Process**:
  1. Builds analysis prompt
  2. Calls Ollama Mistral
  3. Returns code explanation and potential issues
- **Fallback**: Provides basic analysis if Ollama not running

### analyze_execution (POST)
- **Auth**: AllowAny
- **Description**: Analyze code execution output and errors
- **Request**:
  ```json
  {
    "code": "source code",
    "language": "Python",
    "output": "execution output",
    "error": "error message",
    "file_name": "optional.py",
    "analysis_type": "quality"
  }
  ```
- **Process**:
  1. Builds context with code, output, and error
  2. Sends to Ollama Mistral for analysis
  3. Saves to AnalysisHistory if user authenticated
  4. Calculates quality score (low for errors, high for success)
- **Returns**: AI analysis of execution results
- **Features**:
  - Automatic score calculation
  - Analysis history tracking
  - Contextual error/output analysis

### execution_stats (GET/POST)
- **Auth**: IsAuthenticated
- **Description**: Get or update code execution statistics
- **GET Process**:
  1. Retrieves ExecutionStats for user
  2. Creates if doesn't exist
  3. Returns aggregated statistics
- **POST Process**:
  1. Receives execution metadata
  2. Updates ExecutionStats via update_stats() method
  3. Updates language usage tracking
  4. Calculates averages
- **Returns**:
  ```json
  {
    "stats": {
      "total_executions": 10,
      "successful_executions": 8,
      "failed_executions": 2,
      "average_execution_time": 0.45,
      "success_rate": 80,
      "languages_used": { "Python": 5, "Java": 3 },
      "last_execution_date": "2024-04-07T10:30:00Z"
    }
  }
  ```

---

## Utility Modules

### APIResponse (utils.py)
Helper class for consistent API responses across the application.

**Methods**:

#### success(message, data=None, status_code=200)
- **Description**: Return standardized success response
- **Returns**: 
  ```python
  {
    'success': True,
    'message': message,
    'data': data (if provided)
  }
  ```

#### error(message, errors=None, status_code=400)
- **Description**: Return standardized error response
- **Returns**:
  ```python
  {
    'success': False,
    'message': message,
    'errors': errors (if provided)
  }
  ```

---

## Installation & Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Database Setup
```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# (Optional) Create demo users
python manage.py create_demo_user
```

### 3. Environment Variables
Create `.env` file in backend directory:
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### 4. Ollama Setup (for AI features)
```bash
# Install Ollama from https://ollama.ai
ollama pull mistral
ollama serve  # Run in separate terminal
```

### 5. Run Development Server
```bash
python manage.py runserver
```

### 6. Access API
- **Base URL**: `http://localhost:8000/api/`
- **Admin Panel**: `http://localhost:8000/admin/`
- **API Documentation**: Browse endpoints with tool like Postman or curl

---

## Key Features Summary

✅ **User Management**
- JWT-based authentication
- Comprehensive user profiles
- Profile image uploads
- Login history tracking

✅ **Code Execution**
- Multi-language support (Python, Java, C, C++)
- Timeout protection
- Output capture
- Error handling

✅ **AI-Powered Analysis**
- Ollama Mistral integration
- Code quality analysis
- Error diagnosis
- Performance suggestions

✅ **Statistics & History**
- Execution tracking
- Analysis history
- Error logging
- Success metrics

✅ **API Features**
- RESTful endpoints
- JWT authentication
- Filtering & searching
- Pagination support
- CORS enabled

---

**Last Updated**: April 2024
**Version**: 1.0
**Maintainer**: DEBUG_XIA Team
