# 🚀 How to Run Backend Server

## Quick Start

### Step 1: Navigate to Backend Folder
```bash
cd backend
```

### Step 2: Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` at the beginning of your terminal prompt.

### Step 3: Start Django Server
```bash
python manage.py runserver
```

---

## Server Status

✅ **Server Running:** http://localhost:8000

### Test if it's working:
- Open browser: `http://localhost:8000/api/users/me/`
- Or use curl/Postman to test endpoints

---

## Running on Different Ports

### Use Port 8001 (if 8000 is busy):
```bash
python manage.py runserver 8001
```

### Accept External Connections:
```bash
python manage.py runserver 0.0.0.0:8000
```

---

## Available Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/users/signup/` | POST | Register new user |
| `/api/users/signin/` | POST | Login user |
| `/api/users/me/` | GET | Get current user (needs token) |
| `/api/users/logout/` | POST | Logout |
| `/api/profiles/` | GET | List all profiles |
| `/admin/` | GET | Django admin panel |

---

## Test User Credentials

```
Email: user@example.com
Password: 123
```

---

## Troubleshooting

### Error: "Port 8000 already in use"
```bash
# Use a different port
python manage.py runserver 8001
```

### Error: "No module named 'django'"
```bash
# Install dependencies
pip install -r requirements.txt
```

### Error: "ModuleNotFoundError" after dependencies update
```bash
# Deactivate and reactivate virtual environment
deactivate
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

### Database issues
```bash
# Apply migrations
python manage.py migrate

# Create demo user
python manage.py create_demo_user --email test@example.com --password testpass123
```

---

## Common Commands

```bash
# Make migrations (after model changes)
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser for admin
python manage.py createsuperuser

# Interactive Django shell
python manage.py shell

# Collect static files (production)
python manage.py collectstatic

# Run tests
python manage.py test debugxia_api.users
```

---

## Frontend Integration

Once backend is running on `http://localhost:8000`:

1. Start frontend in separate terminal:
   ```bash
   cd DEBUGXIA
   npm run dev
   ```

2. Frontend will be on `http://localhost:5173` or `http://localhost:5174`

3. Frontend automatically connects to backend API

---

## Stop Server

Press `CTRL + C` in the terminal running the server.

---

**Backend is now ready for development!** 🎉
