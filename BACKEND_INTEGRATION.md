# DEBUG_XIA - Full Backend & Frontend Integration Guide

## Overview

This document provides a complete guide to running the fully integrated DEBUG_XIA application with the backend API and frontend.

## Architecture

### Backend (Django REST API)
- **Location**: `backend/`
- **Framework**: Django 4.2.10 + Django REST Framework
- **Database**: SQLite (db.sqlite3)
- **Authentication**: JWT (SimpleJWT)
- **API Base URL**: `http://localhost:8000/api`

### Frontend (React + Vite)
- **Location**: `DEBUGXIA/`
- **Framework**: React 19 + Vite
- **Frontend URL**: `http://localhost:5173`
- **API Client**: Axios with JWT token management

---

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
```

### Step 2: Create Database & Run Migrations

```bash
python manage.py migrate
```

### Step 3: Create a Superuser (Optional - for Django Admin)

```bash
python manage.py createsuperuser
```

### Step 4: Run the Backend Server

```bash
python manage.py runserver
```

**Server will run on**: `http://localhost:8000`

---

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd DEBUGXIA
npm install
```

### Step 2: Configure API URL (Optional)

Create a `.env` file in the `DEBUGXIA/` folder:

```
REACT_APP_API_URL=http://localhost:8000/api
```

### Step 3: Run the Frontend Development Server

```bash
npm run dev
```

**Frontend will run on**: `http://localhost:5173`

---

## API Endpoints

### Authentication Endpoints
- `POST /api/users/signup/` - User registration
- `POST /api/users/signin/` - User login
- `GET /api/users/me/` - Get current user
- `POST /api/users/logout/` - Logout (client-side)
- `PUT /api/users/update_profile/` - Update user profile

### Error Logging Endpoints
- `GET /api/errors/` - List user's error logs (with filtering)
- `POST /api/errors/` - Create new error log
- `GET /api/errors/{id}/` - Get error detail
- `PUT /api/errors/{id}/mark_resolved/` - Mark error as resolved
- `GET /api/errors/statistics/` - Get error statistics
- **Filters**: `severity`, `status`, `error_type`
- **Search**: `search` query parameter

### Code Execution Endpoints
- `GET /api/executions/` - List code executions
- `POST /api/executions/` - Execute code
- `GET /api/executions/statistics/` - Get execution stats
- **Filters**: `language`, `success`

### Analysis Endpoints
- `GET /api/analysis/` - List analysis history
- `POST /api/analysis/` - Create analysis
- `GET /api/analysis/by_type/?type=optimization` - Get by type
- **Filters**: `analysis_type`

### User Profile Endpoints
- `GET /api/profiles/` - Get user profiles
- `GET /api/profiles/{id}/` - Get profile detail
- `PUT /api/profiles/update_my_profile/` - Update profile

---

## Frontend Pages & Features

### Public Pages (Before Login)
- `/` - Home
- `/Features` - Features page
- `/How_It_Works` - How it works
- `/Dashboard` - Demo dashboard
- `/About` - About page
- `/Get_Started` - Sign up page
- `/SingIn` - Sign in page

### Protected Pages (After Login)
- `/Home2` - Main dashboard
- `/Dashboard2` - Statistics & analytics
- `/Profile` - User profile
- `/Error_History` - Error logging & management
- `/Terminal2` - Code execution terminal
- `/Analysis_History` - Code analysis history
- `/Edit_Profile` - Edit profile
- `/Optimizer` - Code optimization (placeholder)

---

## User Flow

### Registration & Login

1. User clicks "Sign Up" on home page
2. Fills in registration form on `/Get_Started`
3. Backend creates user and returns JWT tokens
4. Tokens are stored in `localStorage`
5. User is redirected to `/Home2`

### Error Logging

1. Errors are logged via POST to `/api/errors/`
2. Can be filtered by severity, status, error type
3. User can mark errors as resolved
4. Dashboard shows statistics

### Code Execution

1. Code is submitted via POST to `/api/executions/`
2. Execution results are stored
3. Statistics are available via `/api/executions/statistics/`

---

## Data Models

### User Model
Fields: email, username, first_name, last_name, phone_number, profile_image, bio, is_email_verified, created_at, updated_at

### ErrorLog Model
Fields: user, error_type, error_message, severity (low/medium/high/critical), status (unresolved/resolved), file_path, line_number, code_snippet, ai_suggestion, created_at, updated_at

### CodeExecution Model
Fields: user, language, code, output, execution_time, success, error, created_at

### AnalysisHistory Model
Fields: user, analysis_type, code, suggestions, score, improvements, created_at

### UserProfile Model
Fields: user, company, location, website, last_login_ip, last_login_timestamp

---

## Environment Variables

### Backend (.env file in backend/)
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env file in DEBUGXIA/)
```
REACT_APP_API_URL=http://localhost:8000/api
```

---

## Troubleshooting

### CORS Issues
- Ensure `http://localhost:5173` is in `CORS_ALLOWED_ORIGINS` in Django settings
- Check that `corsheaders.middleware.CorsMiddleware` is in MIDDLEWARE

### JWT Token Issues
- Tokens are stored in `localStorage` with keys: `access_token`, `refresh_token`
- If you see 401 errors, try clearing `localStorage` and logging in again

### API Not Found
- Ensure backend is running on `http://localhost:8000`
- Check that all migrations have been applied: `python manage.py migrate`

### Module Not Found (Frontend)
- Run `npm install` in DEBUGXIA folder
- Ensure `axios` and `react-router-dom` are in package.json

---

## Running Both Together

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd DEBUGXIA
npm run dev
```

Both should be running:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

---

## Git Workflow (VS Code Extension)

The VS Code extension can:
1. Capture code errors from the editor
2. Send errors to `/api/errors/`
3. Execute code snippets via `/api/executions/`
4. Fetch error history from `/api/errors/`
5. Get AI suggestions from error logs

---

## Production Deployment

### Backend
1. Set `DEBUG=False`
2. Update `ALLOWED_HOSTS`
3. Set secure `SECRET_KEY`
4. Use PostgreSQL instead of SQLite
5. Run `python manage.py collectstatic`
6. Deploy with Gunicorn/uWSGI

### Frontend
1. Run `npm run build`
2. Serve `dist/` folder
3. Update `REACT_APP_API_URL` to production API

---

## Support & Documentation

- Django REST Framework: https://www.django-rest-framework.org/
- Vite: https://vitejs.dev/
- React Router: https://reactrouter.com/
- JWT Authentication: https://django-rest-framework-simplejwt.readthedocs.io/
