# 🚀 DEBUG_XIA - Complete Setup Guide

## Project Structure

```
DEBUG_XIA/
├── DEBUGXIA/                    # React Frontend (Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── backend/                     # Django Backend (NEW)
    ├── debugxia_api/
    │   ├── core/               # Project settings
    │   │   ├── settings.py
    │   │   ├── urls.py
    │   │   └── wsgi.py
    │   └── users/              # User authentication app
    │       ├── models.py       # User & UserProfile models
    │       ├── views.py        # API views
    │       ├── serializers.py  # DRF serializers
    │       └── admin.py        # Django admin
    ├── manage.py
    ├── requirements.txt
    ├── db.sqlite3              # SQLite database (auto-created)
    ├── .env                    # Environment variables
    ├── README.md               # Backend documentation
    ├── SETUP.md                # Setup instructions
    ├── API_DOCUMENTATION.md    # API endpoints reference
    └── REACT_INTEGRATION.md    # React integration examples
```

## Getting Started

### Backend Setup (Python/Django)

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Option A - Automatic Setup (Windows):**
   ```bash
   setup.bat
   ```

2. **Option B - Automatic Setup (macOS/Linux):**
   ```bash
   bash setup.sh
   ```

2. **Option C - Manual Setup:**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate it
   venv\Scripts\activate          # Windows
   source venv/bin/activate       # macOS/Linux
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run migrations
   python manage.py migrate
   
   # Create admin user
   python manage.py createsuperuser
   
   # Start server
   python manage.py runserver 8000
   ```

### Frontend Setup (React/Vite)

1. **Navigate to frontend folder:**
   ```bash
   cd DEBUGXIA
   ```

2. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| React App | http://localhost:5173 | Frontend application |
| Django API | http://localhost:8000/api | Backend REST API |
| Django Admin | http://localhost:8000/admin | Database management |

## Database (SQLite)

- **Location:** `backend/db.sqlite3`
- **Auto-created:** Yes, after migrations
- **Contains:** User accounts, profiles, login history, and all other data
- **No external setup:** SQLite is built-in with Python

### Database Tables

1. **users_user** - User accounts and authentication
   - email, username, password (hashed)
   - first_name, last_name
   - phone_number, profile_image, bio
   - is_email_verified, created_at, updated_at

2. **users_userprofile** - Extended user information
   - company, location, website
   - last_login_ip, last_login_timestamp

## API Endpoints

### Authentication
- `POST /api/users/signup/` - Register new user
- `POST /api/users/signin/` - Login user
- `GET /api/users/me/` - Get current user (requires token)
- `POST /api/users/logout/` - Logout

### Profile Management
- `GET /api/profiles/` - List all profiles
- `GET /api/profiles/{id}/` - Get specific profile
- `PATCH /api/profiles/{id}/` - Update profile

**Full API Documentation:** See [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

## React Integration

Use the provided hooks to connect your frontend to the backend:

```javascript
import { useSignUp } from './hooks/useSignUp';
import { useSignIn } from './hooks/useSignIn';
import { useCurrentUser } from './hooks/useCurrentUser';

// Sign up example
const { signup, loading, error } = useSignUp();
await signup(email, username, firstName, lastName, password, passwordConfirm);

// Sign in example
const { signin } = useSignIn();
await signin(email, password);

// Get current user
const { user } = useCurrentUser();
```

**Detailed Examples:** See [backend/REACT_INTEGRATION.md](backend/REACT_INTEGRATION.md)

## Environment Variables

Edit `backend/.env`:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:5173
```

## Key Features

✅ **User Authentication**
- Secure password hashing
- JWT token-based auth
- Email-based login/signup

✅ **User Profiles**
- Extended user information
- User metadata storage
- Login history tracking

✅ **Database**
- SQLite (no setup required)
- Automatic migrations
- Django ORM

✅ **API**
- RESTful architecture
- CORS enabled for React
- Comprehensive error handling
- JWT token authentication

✅ **Admin Panel**
- Django admin interface
- User management
- Profile management

## Admin Credentials

After running `python manage.py createsuperuser`, access admin at:
```
http://localhost:8000/admin/
```

Use the credentials you created during `createsuperuser`.

## Common Commands

```bash
# Create demo user for testing
python manage.py create_demo_user --email test@example.com --password testpass123

# Make migrations (after model changes)
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Collect static files (for production)
python manage.py collectstatic

# Interactive Django shell
python manage.py shell

# Run tests
python manage.py test debugxia_api.users
```

## Troubleshooting

### "No module named 'django'"
```bash
# Make sure virtual environment is activated and dependencies are installed
pip install -r requirements.txt
```

### "Port 8000 already in use"
```bash
# Use different port
python manage.py runserver 8001
```

### CORS errors in React
- Update `FRONTEND_URL` in `.env` to match your React dev server
- Ensure both frontend and backend are running

### Database issues
```bash
# Reset database (WARNING: deletes all data)
rm db.sqlite3
python manage.py migrate
```

## Next Steps

1. ✅ Backend is setup and ready
2. Connect React frontend to backend API
3. Create authentication forms in React
4. Implement protected pages
5. Deploy to production

## Support Files

- [Backend README](backend/README.md) - Full backend documentation
- [Setup Instructions](backend/SETUP.md) - Detailed setup steps
- [API Documentation](backend/API_DOCUMENTATION.md) - Complete API reference
- [React Integration](backend/REACT_INTEGRATION.md) - Frontend integration examples

---

**Happy Coding! 🎉**
