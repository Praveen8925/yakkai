# 🚀 GoDaddy Deployment Guide — Yakkai Neri (React + PHP + MySQL)

## ✅ Your Current Setup is Ready!

Your project structure is **correctly configured** for GoDaddy deployment:
- ✅ React frontend builds to `public_html/`
- ✅ PHP backend goes to `public_html/backend/`
- ✅ MySQL database migrations are ready
- ✅ Deployment script exists (`deploy.ps1`)

---

## 📦 Part 1: Pre-Deployment (On Your Local Machine)

### Step 1: Build the Project

Run the deployment script from your project root:

```powershell
.\deploy.ps1
```

This will:
- Build React frontend (optimized production bundle)
- Copy PHP backend to `public_html/backend/`
- Copy images to `public_html/images/`
- Create `public_html/backend/.env` from template

### Step 2: Edit `public_html/backend/.env`

Open `public_html/backend/.env` in a text editor and **leave the database details blank for now** (you'll get them from GoDaddy cPanel):

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=                    # ← Fill this on GoDaddy cPanel
DB_USER=                    # ← Fill this on GoDaddy cPanel
DB_PASS=                    # ← Fill this on GoDaddy cPanel

JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_STRING_64_CHARS

APP_ENV=production
APP_URL=https://yourdomain.com/backend
FRONTEND_URL=https://yourdomain.com

CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

🔐 **Generate a secure JWT_SECRET**: Visit https://generate-secret.vercel.app/64 and paste the result.

---

## 🌐 Part 2: GoDaddy Setup

### Step 3: Create MySQL Database

1. Log into **GoDaddy cPanel** (usually at `yourdomain.com/cpanel` or `yourdomain.com:2083`)
2. Go to **Databases → MySQL Databases**
3. Create a new database: `cpaneluser_yakkai` (note the full name)
4. Create a new database user: `cpaneluser_dbuser` with a strong password
5. **Add user to database** with **ALL PRIVILEGES**
6. **Write down these credentials** — you'll need them next

### Step 4: Import Database Schema

1. In cPanel, open **phpMyAdmin**
2. Select your new database (`cpaneluser_yakkai`)
3. Click **Import** tab
4. Upload `backend/migrations/create_tables.sql`
5. Click **Go**
6. Repeat for these migration files (in order):
   - `add_admin_tables.sql`
   - `add_assessment_tables.sql`
   - `add_corporate_enquiries.sql`
   - `add_city_and_hr_users.sql`

✅ All tables should now be created.

### Step 5: Upload Files to GoDaddy

#### Option A: FileZilla (Recommended)
1. Install FileZilla FTP client
2. Connect using your GoDaddy FTP credentials:
   - **Host:** `ftp.yourdomain.com`
   - **Username:** Your cPanel username
   - **Password:** Your cPanel password
   - **Port:** 21
3. Navigate to the remote `public_html/` folder
4. **Delete all default GoDaddy files** (index.html, cgi-bin, etc.)
5. Upload **ALL contents** of your local `public_html/` folder

#### Option B: cPanel File Manager
1. Go to **Files → File Manager** in cPanel
2. Open `public_html/`
3. Delete all default files
4. Click **Upload**
5. Upload a **ZIP of your local public_html folder**
6. Right-click the ZIP → **Extract**
7. Delete the ZIP file

### Step 6: Configure Backend `.env` on Server

1. In cPanel File Manager, navigate to `public_html/backend/`
2. Right-click `.env` → **Edit**
3. Fill in your GoDaddy database credentials from Step 3:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpaneluser_yakkai          # ← Your actual database name
DB_USER=cpaneluser_dbuser          # ← Your actual database user
DB_PASS=your_strong_password_here  # ← The password you created

JWT_SECRET=your_64_character_random_string_here

APP_ENV=production
APP_URL=https://yourdomain.com/backend
FRONTEND_URL=https://yourdomain.com

CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

4. **Save**

### Step 7: Test Backend Connection

Visit: `https://yourdomain.com/backend/api/contacts`

You should see:
```json
{
  "success": true,
  "data": []
}
```

✅ Backend is working!

---

## 👤 Part 3: Create Admin User

### Step 8: Run Admin Creation Script

1. Visit: `https://yourdomain.com/backend/create_admin.php`
2. Fill in:
   - Name: Your name
   - Email: admin@yourdomain.com
   - Password: A strong password (min 8 chars, uppercase, lowercase, number, special char)
3. Click **Create Admin User**
4. **IMPORTANT:** Delete the script from the server:
   - In cPanel File Manager, delete `public_html/backend/create_admin.php`

### Step 9: Test Admin Login

1. Visit: `https://yourdomain.com/admin/login`
2. Log in with your admin credentials
3. ✅ You should see the admin dashboard!

---

## 🧪 Part 4: Testing

### Test Checklist

| Component | Test URL | Expected Result |
|-----------|----------|-----------------|
| **Frontend** | `https://yourdomain.com` | Home page loads |
| **Backend API** | `https://yourdomain.com/backend/api/contacts` | JSON response |
| **Admin Login** | `https://yourdomain.com/admin/login` | Login form |
| **Assessment** | `https://yourdomain.com/assessment/individual` | Assessment page |
| **Generate Link** | `https://yourdomain.com/assessment/generate-link` | Link generator |
| **Images** | `https://yourdomain.com/images/banner.jpg` | Image loads |

---

## 🔧 Part 5: How It All Works on GoDaddy

### File Structure on GoDaddy Server

```
public_html/                         ← Your domain root (yourdomain.com/)
│
├── index.html                       ← React's production build (entry point)
├── assets/                          ← React's bundled JS/CSS
│   ├── index-abc123.js             ← Contains ALL your React code
│   └── index-def456.css
│
├── images/                          ← Your images
│   ├── banner.jpg
│   ├── trainer.jpeg
│   └── ...
│
└── backend/                         ← PHP API (yourdomain.com/backend/)
    ├── index.php                    ← API router
    ├── .env                         ← Your database credentials (HIDDEN)
    ├── config/
    ├── routes/
    ├── middleware/
    ├── migrations/
    └── vendor/                      ← Composer dependencies (optional)
```

### How Requests Work

#### Frontend Requests (React)
```
User visits: https://yourdomain.com
↓
GoDaddy serves: public_html/index.html
↓
Browser loads: assets/index-abc123.js (your entire React app)
↓
React Router handles /trainer, /contact, etc. (NO page refreshes)
```

#### API Requests (PHP)
```
React makes: axios.post('/backend/api/auth/login', {...})
↓
GoDaddy runs: public_html/backend/index.php
↓
index.php routes to: backend/routes/auth.php
↓
auth.php queries: MySQL database (via PDO)
↓
Returns JSON: { success: true, token: "..." }
```

### Why React Works on GoDaddy

1. **React builds to static files** — The `npm run build` command converts your entire React app into:
   - 1 HTML file (`index.html`)
   - 1 JavaScript bundle (`assets/index-abc123.js`)
   - 1 CSS bundle (`assets/index-def456.css`)

2. **No Node.js needed on server** — React runs in the user's browser, not on the server. GoDaddy just serves static HTML/JS/CSS files.

3. **React Router handles navigation** — When a user clicks "Trainer" → `/trainer`:
   - React Router changes the URL
   - React re-renders the Trainer component
   - **NO new page load, NO server request**

4. **PHP backend is separate** — Only called when React needs data (login, assessments, gallery, etc.)

---

## 🔒 Part 6: Security Post-Deployment

### Immediate Actions (First 24 Hours)

1. ✅ **Force HTTPS**: In cPanel → Domains → Force HTTPS Redirect (ON)
2. ✅ **Delete sensitive files**:
   - `backend/create_admin.php` (after creating admin)
   - `backend/test.php` (if exists)
   - `backend/seed/seed.php` (after seeding)

### `.htaccess` Setup (Recommended)

GoDaddy uses Apache. Create `public_html/.htaccess`:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# React Router — redirect all routes to index.html (except backend/images)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/backend
RewriteCond %{REQUEST_URI} !^/images
RewriteRule ^.*$ /index.html [L]

# Protect .env files
<FilesMatch "^\.env">
    Order allow,deny
    Deny from all
</FilesMatch>
```

Create `public_html/backend/.htaccess`:

```apache
# Protect sensitive files
<FilesMatch "^(\.env|composer\.(json|lock)|\.gitignore)$">
    Order allow,deny
    Deny from all
</FilesMatch>
```

---

## 📊 Part 7: Monitoring & Maintenance

### Check Backend Logs

In cPanel, check **Logs → Error Log** for PHP errors.

### Database Backups

1. Go to **Databases → phpMyAdmin**
2. Select your database
3. Click **Export** → **Go**
4. Download SQL file and save locally

### Update Workflow

When you make changes locally:

1. Test on localhost
2. Run `.\deploy.ps1`
3. Upload `public_html/` to GoDaddy (overwrite)
4. Test on production

---

## 🆘 Common Issues & Fixes

### Issue 1: "Auth route not found"
✅ **Fixed!** Your `auth.php` now uses `$GLOBALS['requestUri']` (already deployed)

### Issue 2: Frontend shows blank page
- Check browser console (F12) for errors
- Verify `index.html` exists in `public_html/`
- Check `.htaccess` for React Router redirect rule

### Issue 3: API returns 500 error
- Check `public_html/backend/.env` database credentials
- Test direct access: `yourdomain.com/backend/api/contacts`
- Check cPanel Error Log

### Issue 4: Images don't load
- Verify images exist in `public_html/images/`
- Check paths use `/images/` (not `../images/`)

### Issue 5: "Cannot connect to database"
- Verify database name includes cPanel prefix (e.g., `cpaneluser_yakkai`)
- Verify user has ALL PRIVILEGES
- Try `DB_HOST=localhost` or `DB_HOST=127.0.0.1`

---

## 🎉 You're Live!

Your site is now running on GoDaddy with:
- ✅ React frontend served as static files
- ✅ PHP backend handling API requests
- ✅ MySQL database storing all data
- ✅ HTTPS encryption (via GoDaddy SSL)
- ✅ Assessment link generator working
- ✅ Admin dashboard accessible

**Final Test**: Visit `https://yourdomain.com` and explore all pages!

---

## 📞 Support

If you encounter issues:
1. Check GoDaddy's cPanel Error Log
2. Test backend: `yourdomain.com/backend/api/contacts`
3. Verify `.env` credentials match cPanel MySQL settings
4. Check browser console (F12) for frontend errors

**GoDaddy Support**: https://www.godaddy.com/help
