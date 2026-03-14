# 🚀 Vercel Deployment Guide — Yakkai Neri

Vercel is an excellent choice for hosting your React frontend. However, since your backend uses PHP and MySQL, there are a few extra steps and considerations compared to a traditional host like GoDaddy.

## ⚠️ Critical Requirements for Vercel

Unlike GoDaddy, Vercel is a **Serverless** platform. This means:
1.  **Remote Database Required**: Vercel cannot host MySQL. You MUST use a remote database (e.g., Aiven, TiDB Cloud, or push your local DB to a cloud provider).
2.  **No Persistent File Storage**: Uploaded images cannot be saved to the server's disk (it's read-only). For a production app on Vercel, you would eventually need a service like **Cloudinary** or **S3** for uploads.
3.  **Monorepo Config**: I have already created a `vercel.json` in your root directory to handle both the React frontend and PHP backend.

---

## 🛠️ Step 1: Prepare Your Remote Database

Vercel cannot connect to `localhost`. You need a cloud MySQL database.
-   **Recommended**: [Aiven](https://aiven.io/mysql) or [TiDB Cloud](https://pingcap.com/tidb-cloud) (both have free tiers).
-   **Alternative**: Use your GoDaddy MySQL database if you have one, but you must enable **Remote MySQL** in cPanel and whitelist Vercel's IP ranges (which is difficult).

Once you have a cloud DB:
1.  Import your SQL files from `backend/migrations/` using a tool like phpMyAdmin or MySQL Workbench.

---

## 📦 Step 2: Set Environment Variables on Vercel

When you import your project into Vercel, you must set these **Environment Variables**:

| Variable | Value (Example) |
| :--- | :--- |
| `DB_HOST` | `your-cloud-db-host.com` |
| `DB_PORT` | `3306` |
| `DB_NAME` | `yakkai_neri` |
| `DB_USER` | `admin` |
| `DB_PASS` | `yourpassword` |
| `JWT_SECRET` | `(a long random string)` |
| `APP_ENV` | `production` |
| `APP_URL` | `https://your-project.vercel.app` |

---

## 🚀 Step 3: Deploy to Vercel

Since your project is already on GitHub, follow these steps:

1.  **Commit the configuration**:
    ```powershell
    git add vercel.json backend/index.php
    git commit -m "Add Vercel deployment configuration"
    git push origin main
    ```

2.  **Import to Vercel**:
    -   Go to [vercel.com](https://vercel.com) and click **"Add New" → "Project"**.
    -   Import your `yakkai` repository.
    -   Vercel will detect the `vercel.json` and use it.
    -   **IMPORTANT**: Add the Environment Variables listed in Step 2 during the "Environment Variables" section of the import.
    -   Click **Deploy**.

---

## 📂 Configuration Details (Done for You)

I have already made the following changes:

1.  **`vercel.json` (Root)**:
    -   Configures the monorepo to build the React app in `frontend/`.
    -   Configures the PHP runtime for `backend/index.php`.
    -   Sets up rewrites so `yourdomain.com/api` automatically routes to your PHP backend.

2.  **`backend/index.php`**:
    -   Patched to correctly read environment variables from Vercel's system (instead of just looking for a local `.env` file).

---

## 🧪 Testing Your Deployment

Once deployed, visit:
-   `https://your-project.vercel.app` (Frontend)
-   `https://your-project.vercel.app/api/contacts` (Backend Health Check)

---

## 🆘 Troubleshooting

-   **500 Error on /api**: Check Vercel logs. It's usually a database connection failure (`DB_HOST` or credentials).
-   **404 Error**: Ensure `vercel.json` is in the root directory and you have pushed it to GitHub.
-   **Uploads Fail**: Remember that Vercel doesn't support local file uploads. The backend will try to write to `frontend/public/uploads`, which will fail on Vercel. For now, focus on the UI and API functionality.
