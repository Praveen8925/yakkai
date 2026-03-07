# ─────────────────────────────────────────────────────────────────────────────
# deploy.ps1  — Build frontend + copy backend into public_html/
#
# Usage (from project root):
#   .\deploy.ps1
#
# After running, upload the entire public_html/ folder to GoDaddy public_html/
# ─────────────────────────────────────────────────────────────────────────────

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root       = $PSScriptRoot
$frontend   = Join-Path $root "frontend"
$backend    = Join-Path $root "backend"
$publicHtml = Join-Path $root "public_html"
$backendOut = Join-Path $publicHtml "backend"

Write-Host ""
Write-Host "=== YAKKAI DEPLOY ===" -ForegroundColor Cyan

# ── 1. Build React frontend ───────────────────────────────────────────────────
Write-Host "`n[1/3] Building React frontend..." -ForegroundColor Yellow
Set-Location $frontend
npm run build
Set-Location $root
Write-Host "    Frontend built to public_html/" -ForegroundColor Green

# ── 2. Copy backend to public_html/backend/ ───────────────────────────────────
Write-Host "`n[2/3] Copying backend files..." -ForegroundColor Yellow

# Remove old backend copy (except .env so we don't overwrite GoDaddy credentials)
$envFile = Join-Path $backendOut ".env"
$envBackup = $null
if (Test-Path $envFile) {
    $envBackup = Get-Content $envFile -Raw
}

Remove-Item -Path $backendOut -Recurse -Force -ErrorAction SilentlyContinue

# Exclude: .env (use .env.example to set up), test.php (debug file), vendor/ (install on server)
Copy-Item -Path $backend -Destination $backendOut -Recurse -Exclude ".env","test.php"

# Restore .env if it existed (don't overwrite production credentials)
if ($envBackup) {
    Set-Content -Path $envFile -Value $envBackup
    Write-Host "    Preserved existing public_html/backend/.env" -ForegroundColor Yellow
} else {
    # Create blank .env from example
    Copy-Item (Join-Path $backend ".env.example") $envFile
    Write-Host "    Created public_html/backend/.env from .env.example" -ForegroundColor Yellow
    Write-Host "    >>> IMPORTANT: Edit public_html/backend/.env with your GoDaddy DB credentials!" -ForegroundColor Red
}

Write-Host "    Backend copied to public_html/backend/" -ForegroundColor Green

# ── 3. Copy images folder ─────────────────────────────────────────────────────
Write-Host "`n[3/3] Copying images folder..." -ForegroundColor Yellow
$imagesOut = Join-Path $publicHtml "images"
if (Test-Path (Join-Path $root "images")) {
    Copy-Item -Path (Join-Path $root "images") -Destination $imagesOut -Recurse -Force
    Write-Host "    Images copied to public_html/images/" -ForegroundColor Green
} else {
    New-Item -ItemType Directory -Path $imagesOut -Force | Out-Null
    Write-Host "    Created empty public_html/images/" -ForegroundColor Green
}

# ── Done ──────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "=== BUILD COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "public_html/ is ready to upload to GoDaddy." -ForegroundColor White
Write-Host ""
Write-Host "GoDaddy Checklist:" -ForegroundColor Yellow
Write-Host "  1. Upload ALL contents of public_html/ to your GoDaddy public_html/"
Write-Host "  2. Edit public_html/backend/.env with your GoDaddy MySQL credentials"
Write-Host "      DB_HOST  = localhost (usually)"
Write-Host "      DB_NAME  = cpaneluser_dbname"
Write-Host "      DB_USER  = cpaneluser_dbuser"
Write-Host "      DB_PASS  = your password"
Write-Host "      APP_ENV  = production"
Write-Host "      APP_URL  = https://yourdomain.com/backend"
Write-Host "  3. In GoDaddy cPanel -> MySQL, import migrations/create_tables.sql"
Write-Host "  4. Run the seeder: https://yourdomain.com/backend/seed/seed.php"
Write-Host "  5. Delete seed.php from the server after seeding!"
Write-Host ""
