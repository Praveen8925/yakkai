# 📤 Push to GitHub Repository

## Your repository is ready! Follow these steps:

---

## Step 1: Add All Files to Git

```powershell
git add .
```

This stages all files (`.gitignore` will automatically exclude sensitive files).

---

## Step 2: Create Initial Commit

```powershell
git commit -m "Initial commit: Yakkai Neri Yoga Academy - React + PHP + MySQL"
```

---

## Step 3: Create GitHub Repository

### Option A: Via GitHub Website (Recommended)
1. Go to https://github.com/new
2. Repository name: `yakkai-neri` (or your choice)
3. Description: `Yakkai Neri Yoga Academy - Full-stack webapp with React, PHP, and MySQL`
4. **Keep it Private** (recommended — contains business logic)
5. **DO NOT** initialize with README (you already have one)
6. Click **Create repository**

### Option B: Via GitHub CLI (if installed)
```powershell
gh repo create yakkai-neri --private --source=. --remote=origin --push
```

---

## Step 4: Link Your Local Repo to GitHub

Copy the commands from GitHub's "Quick setup" page, or use:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/yakkai-neri.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 5: Verify Push

Visit your GitHub repo URL:
```
https://github.com/YOUR_USERNAME/yakkai-neri
```

✅ You should see all your files!

---

## 🔐 Security Check: What's NOT Pushed (Protected by .gitignore)

These sensitive files are **automatically excluded**:

| File/Folder | Why Excluded | Notes |
|-------------|--------------|-------|
| `.env` files | Database passwords, JWT secrets | ✅ Protected |
| `node_modules/` | 200MB+ of dependencies | ✅ Protected |
| `vendor/` | PHP Composer packages | ✅ Protected |
| `public_html/` | Build output (deploy folder) | ✅ Protected |
| `*.log` | Runtime logs | ✅ Protected |
| `uploads/` | User-uploaded files | ✅ Protected |

---

## 📋 What IS Pushed (Safe to Share)

✅ Source code (React, PHP)  
✅ Database migrations (SQL schema)  
✅ Documentation (README, guides)  
✅ Configuration templates (`.env.example`)  
✅ Deployment scripts  
✅ Static assets (images in `images/`)  

---

## 🔄 Future Updates (After Initial Push)

When you make changes locally:

```powershell
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with message
git commit -m "Add assessment link generator feature"

# 4. Push to GitHub
git push
```

---

## 🌿 Branch Strategy (Optional but Recommended)

For safer development:

```powershell
# Create feature branch
git checkout -b feature/new-assessment-type

# Make changes, commit them
git add .
git commit -m "Add new assessment type"

# Push branch
git push -u origin feature/new-assessment-type

# On GitHub: Create Pull Request → Merge to main
```

---

## 👥 Collaborating (If You Add Team Members)

1. Go to GitHub repo → **Settings** → **Collaborators**
2. Add team members by GitHub username
3. They clone repo: `git clone https://github.com/YOUR_USERNAME/yakkai-neri.git`

---

## 🆘 Common Issues

### "fatal: remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/yakkai-neri.git
```

### "Authentication failed"
Use GitHub Personal Access Token (PAT) instead of password:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when pushing

### "Large files detected"
If you accidentally try to push large files:
```powershell
# Remove from staging
git reset HEAD public_html/

# Re-commit without large files
git commit -m "Initial commit"
```

---

## 🎯 Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `git status` | Check what changed |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Commit changes |
| `git push` | Push to GitHub |
| `git pull` | Pull latest from GitHub |
| `git log --oneline` | View commit history |
| `git diff` | See unstaged changes |

---

## ✅ You're Done!

Your code is now:
- ✅ Version controlled (Git)
- ✅ Backed up (GitHub)
- ✅ Shareable (via GitHub URL)
- ✅ Secure (sensitive files excluded)

---

## 📦 Cloning on Another Machine

To work on another computer:

```powershell
# Clone repo
git clone https://github.com/YOUR_USERNAME/yakkai-neri.git
cd yakkai-neri

# Install frontend dependencies
cd frontend
npm install
cd ..

# Create backend .env from example
Copy-Item backend\.env.example backend\.env
# Edit backend\.env with your local database credentials

# Create frontend .env files
Copy-Item frontend\.env.production frontend\.env.development
# Edit if needed

# Start development
# Frontend: cd frontend; npm run dev
# Backend: Start WAMP server
```

---

## 🔗 Repository Best Practices

### README.md
Your `README.md` is already great! It shows up as the repo homepage.

### Releases/Tags (Optional)
When deploying to production:
```powershell
git tag -a v1.0.0 -m "Initial production release"
git push origin v1.0.0
```

### GitHub Actions (Advanced)
You can automate deployment using GitHub Actions, but manual deployment via `deploy.ps1` works perfectly fine.

---

**Need help?** Check GitHub's documentation: https://docs.github.com/en/get-started
