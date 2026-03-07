# 🚀 Quick Deployment Checklist

## ✅ Your File Structure is Correct!

```
yakkai-main/
├── frontend/              ✅ React app (builds to public_html/)
├── backend/               ✅ PHP API
├── images/                ✅ Static images
├── public_html/           ✅ Deployment folder (upload to GoDaddy)
└── deploy.ps1             ✅ Deployment script
```

---

## 📋 Deployment Steps (30 minutes)

### On Your Computer

- [ ] 1. Run `.\deploy.ps1` from project root
- [ ] 2. Edit `public_html/backend/.env` (change JWT_SECRET, keep DB_ blank)

### On GoDaddy cPanel

#### Database Setup (5 min)
- [ ] 3. Create MySQL database
- [ ] 4. Create database user + add to database (ALL PRIVILEGES)
- [ ] 5. Open phpMyAdmin → Import all migration files from `backend/migrations/`

#### Upload Files (10 min)
- [ ] 6. Open File Manager → Delete default `public_html/` contents
- [ ] 7. Upload ALL contents of your `public_html/` folder
- [ ] 8. Edit `public_html/backend/.env` → Fill in DB credentials from step 3

#### Testing (5 min)
- [ ] 9. Visit: `https://yourdomain.com/backend/api/contacts` (should return JSON)
- [ ] 10. Visit: `https://yourdomain.com` (home page should load)

#### Admin Setup (5 min)
- [ ] 11. Visit: `https://yourdomain.com/backend/create_admin.php`
- [ ] 12. Create admin user
- [ ] 13. **DELETE** `create_admin.php` from server
- [ ] 14. Test login: `https://yourdomain.com/admin/login`

#### Security (5 min)
- [ ] 15. Force HTTPS in cPanel → Domains
- [ ] 16. Create `.htaccess` files (see guide)
- [ ] 17. Test all pages work

---

## 🎯 Critical Files on GoDaddy

```
public_html/
├── index.html              ← React entry point
├── assets/                 ← React bundles (auto-generated)
├── images/                 ← Copy from local
└── backend/
    ├── index.php           ← PHP API router
    ├── .env                ← DB credentials (EDIT THIS!)
    └── migrations/         ← SQL files (import to phpMyAdmin)
```

---

## 🔐 `.env` Template for GoDaddy

```dotenv
DB_HOST=localhost
DB_NAME=cpaneluser_yakkai     # ← Your cPanel database name
DB_USER=cpaneluser_dbuser     # ← Your cPanel database user
DB_PASS=your_password_here    # ← Your database password

JWT_SECRET=generate_64_char_random_string  # ← https://generate-secret.vercel.app/64

APP_ENV=production
APP_URL=https://yourdomain.com/backend
FRONTEND_URL=https://yourdomain.com

CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 🧪 Test URLs After Deployment

| Test | URL | Expected |
|------|-----|----------|
| Home | `https://yourdomain.com` | Site loads |
| API | `https://yourdomain.com/backend/api/contacts` | `{"success":true,"data":[]}` |
| Trainer | `https://yourdomain.com/trainer` | Trainer page |
| Admin | `https://yourdomain.com/admin/login` | Login form |
| Assessment | `https://yourdomain.com/assessment/individual` | Assessment |
| Link Gen | `https://yourdomain.com/assessment/generate-link` | Link generator |

---

## 💡 How It Works

### React on GoDaddy
- React builds to **static HTML/JS/CSS** files
- No Node.js needed on server
- GoDaddy serves static files
- React Router runs in browser

### PHP Backend
- GoDaddy has **PHP 8.x** built-in
- Your `backend/` folder = API server
- MySQL database via cPanel phpMyAdmin

### Assessment Links
- Generate: `https://yourdomain.com/assessment/generate-link`
- Created links use production domain automatically
- Example: `https://yourdomain.com/assessment/individual?lid=IND-ABC123XY`

---

## 🆘 Common Issues

### API returns 404
✅ Check `public_html/backend/.env` exists and has DB credentials

### Blank page
✅ Check browser console (F12) for errors
✅ Verify `index.html` exists in `public_html/`

### "Cannot connect to database"
✅ DB name must include cPanel prefix: `cpaneluser_yakkai` (not just `yakkai`)
✅ User must have ALL PRIVILEGES on database

### Images don't load
✅ Copy `images/` folder to `public_html/images/`

---

## ✅ Done!

Your React + PHP + MySQL app is now live on GoDaddy!

📖 Full guide: `GODADDY_DEPLOYMENT_GUIDE.md`
