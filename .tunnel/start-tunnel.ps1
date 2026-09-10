# ============================================================
# VisionFlow AI - Tunnel Launcher (no-register public access)
# One-click: dev server + serveo tunnel + cloudflared backup
# Usage: powershell -ExecutionPolicy Bypass -File start-tunnel.ps1
# NOTE: free tunnel URLs change on every restart, check output
# ============================================================
$ErrorActionPreference = 'SilentlyContinue'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "== VisionFlow AI tunnel ==" -ForegroundColor Cyan

# 1) dev server
if (Get-NetTCPConnection -LocalPort 2323 -State Listen) {
    Write-Host "[1/3] dev server: already running" -ForegroundColor Green
} else {
    Start-Process cmd.exe -ArgumentList "/c pnpm dev > dev.log 2>&1" -WindowStyle Hidden
    Write-Host "[1/3] dev server: starting..." -ForegroundColor Yellow
    Start-Sleep -Seconds 7
}

# 2) serveo tunnel (primary)
Set-Location "$root\.tunnel"
$serveoAlive = Get-CimInstance Win32_Process -Filter "Name='ssh.exe'" | Where-Object { $_.CommandLine -match 'serveo' }
if ($serveoAlive) {
    Write-Host "[2/3] serveo: already running" -ForegroundColor Green
} else {
    Start-Process cmd.exe -ArgumentList "/c echo y | ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:localhost:2323 serveo.net > serveo.log 2>&1" -WindowStyle Hidden
    Write-Host "[2/3] serveo: starting..." -ForegroundColor Yellow
}

# 3) cloudflared tunnel (backup)
$cfAlive = Get-CimInstance Win32_Process -Filter "Name='cloudflared.exe'"
if ($cfAlive) {
    Write-Host "[3/3] cloudflared: already running" -ForegroundColor Green
} else {
    Start-Process cmd.exe -ArgumentList "/c .\cloudflared.exe tunnel --url http://127.0.0.1:2323 --no-autoupdate --protocol http2 > tunnel.log 2>&1" -WindowStyle Hidden
    Write-Host "[3/3] cloudflared: starting..." -ForegroundColor Yellow
}

Start-Sleep -Seconds 14

Write-Host ""
Write-Host "== Access URLs ==" -ForegroundColor Cyan
$serveoUrl = (Select-String -Path serveo.log -Pattern "https://[a-z0-9-]+\.serveousercontent\.com" | Select-Object -Last 1).Matches.Value
$cfUrl = (Select-String -Path tunnel.log -Pattern "https://[a-z0-9-]+\.trycloudflare\.com" | Select-Object -Last 1).Matches.Value
$lan = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254*' } | Select-Object -First 1).IPAddress

if ($serveoUrl) { Write-Host ("Mobile / WAN (serveo): " + $serveoUrl) -ForegroundColor White }
if ($cfUrl)     { Write-Host ("Mobile / WAN (backup): " + $cfUrl) -ForegroundColor White }
if ($lan)       { Write-Host ("Same WiFi (LAN): http://" + $lan + ":2323") -ForegroundColor White }

Write-Host ""
Write-Host "Note: free tunnel URLs change on restart; register for a fixed URL." -ForegroundColor DarkGray
