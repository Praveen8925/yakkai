# sync-backend.ps1
# Run this from D:\yakkai-main after any backend file change:
#   .\sync-backend.ps1

$src  = "D:\yakkai-main\backend"
$dest = "C:\wamp64\www\Yakkai_Neri\backend"

Copy-Item -Path $src -Destination $dest -Recurse -Force
Write-Host "✓ Backend synced to $dest" -ForegroundColor Green
