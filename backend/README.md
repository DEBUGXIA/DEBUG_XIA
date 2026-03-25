# Django Backend for DEBUG_XIA

A Django REST Framework backend with SQLite database for user authentication and profile management.

## Features

- **User Authentication**
  - Sign up with email and password
  - Sign in with email and password
  - JWT token-based authentication
  - User profile management

- **Database**
  - SQLite3 (included, no external setup needed)
  - User model with extended fields
  - User profile model for additional information
  - Admin panel for management

- **API Endpoints**
  - RESTful API architecture
  - CORS enabled for React frontend integration
  - Comprehensive error handling

## Quick Start

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Start server:
   ```bash
   python manage.py runserver 8000
   ```

## Project Structure

```
backend/
├── debugxia_api/
│   ├── core/              # Django project settings
│   │   ├── settings.py    # Main configuration
│   │   ├── urls.py        # URL routing
│   │   └── wsgi.py        # WSGI config
│   └── users/             # User app
│       ├── models.py      # User and UserProfile models
│       ├── views.py       # API views
│       ├── serializers.py # DRF serializers
│       └── admin.py       # Admin configuration
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
└── db.sqlite3            # SQLite database (auto-created)
```

## Environment Variables

Create a `.env` file with:
```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:5173
```

## API Documentation

See [SETUP.md](SETUP.md) for detailed API endpoint documentation.

## Integration with React Frontend

The React app (running on http://localhost:5173) can communicate with the backend on http://localhost:8000.

Example API call:
```javascript
const response = await fetch('http://localhost:8000/api/users/signup/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'username',
    password: 'password',
    password_confirm: 'password'
  })
});
```

## Admin Panel

Access Django admin at: `http://localhost:8000/admin/`
Log in with your superuser credentials.
