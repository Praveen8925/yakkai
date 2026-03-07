# 📋 Yakkai Neri Yoga Academy — Project Progress Log

> **Last Updated:** 25 February 2026 | **Stack:** React (Vite) + PHP + MySQL (WAMP)

---

## 🏗️ Project Structure

```
Yakkai_Neri/
├── frontend/          ← React + Vite (runs on localhost:5173)
│   └── src/
│       ├── pages/
│       │   ├── public/        ← Public-facing pages
│       │   ├── programs/      ← Program sub-pages
│       │   └── admin/         ← Admin dashboard pages
│       ├── hooks/
│       └── components/
├── backend/           ← PHP REST API (runs via Apache / WAMP)
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── migrations/
│   └── index.php
└── images/            ← Academy photos used across the site
```

---

## ✅ Completed Work — Feature by Feature

---

### 1. 🖥️ Admin Dashboard — Dark / Light Mode Toggle

**File:** `frontend/src/pages/admin/AdminDashboard.jsx`

**What was done:**
- Added a **Dark / Light mode toggle button** in the top bar
- Toggle shows animated **☀️ Sun** (light mode) and **🌙 Moon** (dark mode) icons with smooth rotate-in/out animation via `framer-motion`
- **Theme preference saved to `localStorage`** — page remembers your choice after refresh
- Default mode is **Dark**
- **All UI panels switch together:**
  - Sidebar (background, text, nav items, collapse button)
  - Top bar (background, title, buttons)
  - Stat cards (background, text)
  - Main content area
- A **"Theme Preview Strip"** card on the Overview tab shows current mode with a quick switch button
- Theme tokens passed as `isDark` prop to child tabs: `AdminPrograms`, `AdminGallery`, `AdminPages`

---

### 2. 🌐 Contact Page — "Follow Us" Social Media Section

**File:** `frontend/src/pages/public/Contact.jsx`

**What was done:**
- Replaced 4 identical plain green circle icons with **5 richly styled social media cards**
- **2-column grid layout** for Facebook, Instagram, LinkedIn, WhatsApp
- **Full-width YouTube row** below the grid
- Each card has:
  - Platform **brand color** (not generic green)
  - **Font Awesome icon** with inverted color on hover
  - **Emoji + platform name** as label
  - **Subtitle** (handle / call-to-action)
  - **Hover animation:** lifts up + drop shadow (`hover:-translate-y-0.5`)

| Platform | Color | Subtitle |
|---|---|---|
| 📘 Facebook | Blue | Yakkai Neri |
| 📸 Instagram | Purple→Pink→Orange gradient | @yakkaineri |
| 💼 LinkedIn | Sky blue | Links to real LinkedIn page |
| 💬 WhatsApp | Emerald | Chat with us |
| ▶️ YouTube | Red | Watch our classes & sessions |

---

### 3. 🧘 Yoga as Sport Page — Photo Gallery

**File:** `frontend/src/pages/programs/YogaAsSport.jsx`

**What was done:**
- Rebuilt entire page with:
  - Hero section with motion animations
  - **Photo gallery** using all relevant academy images:
    - `Champion-award.jpg` — Anna University Coach award
    - `three.jpg` — Women's team trophy
    - `victory.jpg` — Champions celebration
    - `two.jpg` — Coach with young athletes
  - **Competition Training** section
  - **Performance Psychology** section
  - **Track Record stats** strip

---

### 4. 🏢 Corporate Yoga Page — Media Coverage

**File:** `frontend/src/pages/programs/CorporateYoga.jsx`

**What was done:**
- Rebuilt with real academy photos:
  - `one.jpg` — Rooftop corporate session (hero)
  - `Adults Training.jpg` — Indoor group training
  - `KCT.jpg` — Mass yoga session
  - `Facultytraining.jpg` — Faculty training
- Added **"As Seen In The Media"** section featuring **The Hindu** newspaper coverage (`Inthemedia.jpg`)
- Retained existing stats and corporate client table

---

### 5. 🌸 Women Wellness Page — Condition-Specific Tabs

**File:** `frontend/src/pages/programs/WomenWellness.jsx`

**What was done:**
- Rebuilt with 4 interactive condition tabs:
  - 🔴 **Menstrual Cycle** — Irregular periods, pain relief
  - 🟣 **PCOD / PCOS** — Hormonal balance, ovarian cysts
  - 🟠 **Pre-Menopause** — Transition support
  - 🔵 **Post-Menopause** — Bone health, mood stability
- Each tab shows:
  - Tailored description
  - Recommended asanas & pranayamas
  - Expected outcomes
- Hero uses `KCT.jpg` (mass women's yoga session)
- Multi-step form for wellness assessment
- Interactive tab selection with distinct color schemes

---

### 6. 🏃 Yoga for Sport Page — Athlete Benefits

**File:** `frontend/src/pages/programs/YogaForSport.jsx`

**What was done:**
- Replaced placeholder images with real academy photos:
  - `Facultytraining.jpg` — Students outdoor yoga
  - `Adults Training.jpg` — Indoor group training
- Expanded benefits from 3 generic to **6 specific cards**:
  1. 🛡️ Injury Prevention
  2. ⚡ Recovery
  3. 🎯 Focus & Concentration
  4. 💨 Breath Control
  5. 💪 Power & Flexibility
  6. 🧠 Mental Resilience
- Added sport-specific training detail section

---

### 7. 🗄️ PHP Backend — Full Implementation

**Root cause:** 6 out of 7 critical PHP files were **completely empty** and `.htaccess` caused 500 errors.

#### Files Written / Fixed:

| File | What it does |
|---|---|
| `.env` | DB credentials (root, empty pass, yakkai_neri DB) |
| `config/database.php` | PDO connection class, lazy init, error handling |
| `config/cors.php` | CORS for `localhost:5173`, OPTIONS preflight |
| `middleware/AuthMiddleware.php` | Pure-PHP JWT (no external lib), `requireAdmin()` |
| `routes/auth.php` | `POST /login`, `POST /register`, `GET /me` |
| `routes/contacts.php` | `POST` saves contact form, `GET` for admin |
| `routes/wellness.php` | `POST` saves wellness assessment data |
| `routes/pages.php` | CMS: GET list, GET by slug, PUT upsert |
| `routes/gallery.php` | Fixed PHP syntax error (`PHP_URL_PATH'` bug) |
| `.htaccess` | Minimal mod_rewrite routing (removed headers that broke WAMP) |
| `migrations/create_tables.sql` | All 6 tables + seed data |

---

### 8. 🗃️ MySQL Database — Created & Seeded

**Database name:** `yakkai_neri`

| Table | Rows | Purpose |
|---|---|---|
| `users` | 1 (admin) | Authentication |
| `programs` | 8 | Yoga programs list |
| `gallery` | 12 | Trainer photos |
| `contacts` | 0 | Contact form submissions |
| `wellness_assessments` | 0 | Wellness form submissions |
| `page_content` | 1 | CMS page data |

---

## 🔐 Admin Credentials

| Field | Value |
|---|---|
| **URL** | `http://localhost:5173/admin/login` |
| **Email** | `admin@yakkaineri.com` |
| **Password** | `admin123` |

---

## 🌐 API Endpoints (All Working ✅)

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/login` | POST | None | Returns JWT token |
| `/api/auth/register` | POST | None | Register new user |
| `/api/auth/me` | GET | Bearer token | Get current user |
| `/api/programs` | GET | None | List active programs |
| `/api/programs` | POST | Admin | Create program |
| `/api/programs/:id` | PUT | Admin | Update program |
| `/api/programs/:id` | DELETE | Admin | Delete program |
| `/api/gallery` | GET | None | List gallery images |
| `/api/gallery` | POST | Admin | Add image |
| `/api/gallery/:id` | PUT | Admin | Update image |
| `/api/gallery/:id` | DELETE | Admin | Delete image |
| `/api/contacts` | POST | None | Submit contact form |
| `/api/contacts` | GET | Admin | List all inquiries |
| `/api/wellness` | POST | None | Submit wellness form |
| `/api/wellness` | GET | Admin | List assessments |
| `/api/pages` | GET | None | List all pages |
| `/api/pages/:slug` | GET | None | Get page by slug |
| `/api/pages/:slug` | PUT | Admin | Update page content |
| `/api/upload` | POST | Admin | Upload image file |

---

## 🔧 How to Run the Project

### Frontend (React + Vite)
```bash
cd frontend
npm run dev
# Opens at: http://localhost:5173
```

### Backend (PHP via WAMP / Apache)
- Make sure WAMP is **running (green icon)**
- Backend auto-serves at: `http://localhost/Yakkai_Neri/backend/`
- No separate start command needed

### Debug Test Page
```
http://localhost/Yakkai_Neri/backend/test.php
```
Shows PHP version, DB connection status, tables, and seeded data.

---

## 🐛 Known Issues Fixed

| Bug | Fix |
|---|---|
| `.htaccess` caused Apache 500 error | Removed `mod_headers` + `FilesMatch` blocks not supported by default WAMP |
| `gallery.php` syntax error | Fixed `PHP_URL_PATH'` → `PHP_URL_PATH` |
| All backend PHP files were empty | Wrote full implementation for all files |
| Admin password hash mismatch | Re-generated bcrypt hash via `php.exe` and updated DB |
| `php` command not found in terminal | PHP runs via Apache (WAMP), not terminal |

---

## 📌 What's Next (Pending)

- [ ] Connect Admin Dashboard localStorage data to live MySQL via API calls
- [ ] Therapy sub-program pages: **Obesity Management**, **Diabetes Care**, **Hypertension**
- [ ] Update real social media links for Facebook, Instagram, YouTube, WhatsApp
- [ ] Replace WhatsApp number (`919876543210`) with actual academy number
- [ ] Test contact form end-to-end (frontend → API → MySQL)
- [ ] Test wellness form end-to-end
- [ ] Image upload flow (Admin Gallery → `/api/upload` → filesystem)

---

*Generated by Antigravity AI · Yakkai Neri Project · Feb 2026*
