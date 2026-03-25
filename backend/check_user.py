import sqlite3
import sys
from datetime import datetime

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

# Get email from command line if provided
email_to_check = sys.argv[1] if len(sys.argv) > 1 else None

print("\n" + "=" * 80)
print("DATABASE - ALL USERS (REAL-TIME)".center(80))
print("=" * 80)

# Get all users
cursor.execute("""
    SELECT id, email, username, first_name, last_name, is_active, created_at 
    FROM users_user 
    ORDER BY created_at DESC
""")

all_users = cursor.fetchall()

if not all_users:
    print("\n   ✗ No users found in database\n")
else:
    print(f"\n   📊 TOTAL USERS: {len(all_users)}\n")
    
    for i, user in enumerate(all_users, 1):
        user_id, email, username, first_name, last_name, is_active, created_at = user
        status = "✓ Active" if is_active else "✗ Inactive"
        name = f"{first_name} {last_name}".strip() or "N/A"
        
        # Highlight if searching for specific user
        highlight = ">>> " if (email_to_check and email == email_to_check) else "    "
        
        print(f"{highlight}{i}. {email}")
        print(f"    ├─ ID: {user_id}")
        print(f"    ├─ Username: {username}")
        print(f"    ├─ Name: {name}")
        print(f"    ├─ Status: {status}")
        print(f"    └─ Created: {created_at}\n")

# If specific user search requested, show result
if email_to_check:
    print("=" * 80)
    cursor.execute("SELECT id FROM users_user WHERE email = ?", (email_to_check,))
    result = cursor.fetchone()
    if result:
        print(f"✓ SEARCH RESULT: User '{email_to_check}' FOUND (ID: {result[0]})".center(80))
    else:
        print(f"✗ SEARCH RESULT: User '{email_to_check}' NOT FOUND".center(80))

print("=" * 80)
print()

conn.close()
