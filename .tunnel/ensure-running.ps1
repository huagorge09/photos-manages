# ============================================================
# VisionFlow AI - ensure-running.ps1 (idempotent self-heal launcher)
# Pulls up whichever of these is down:
#   1) dev server (port 2323)
#   2) serveo tunnel
#   3) cloudflared tunnel
#   4) watch-tunnel watchdog
# Safe to run repeatedly (checks before starting).
# Registered as a logon task so it auto-recovers after reboot.
# ============================================================
$ErrorActionPreference = 'SilentlyContinue'
$root = Split-Path -Parent $PSScriptRoot
$tun = "$root\.tunnel"
Set-Location $root

# 1) dev server
if (Get-NetTCPConnection -LocalPort 2323 -State Listen) {
    Write-Output "[1/4] dev: already running"
} else {
    Write-Output "[1/4] dev: starting..."
    Start-Process cmd.exe -ArgumentList "/c pnpm dev > dev.log 2>&1" -WindowStyle Hidden -WorkingDirectory $root
    Start-Sleep -Seconds 8
}

# 2) serveo tunnel
$sshAlive = Get-CimInstance Win32_Process -Filter "Name='ssh.exe'" | Where-Object { $_.CommandLine -match 'serveo' }
if ($sshAlive) {
    Write-Output "[2/4] serveo: already running"
} else {
    Write-Output "[2/4] serveo: starting..."
    Start-Process cmd.exe -ArgumentList "/c echo y | ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -R 80:localhost:2323 serveo.net > serveo.log 2>&1" -WindowStyle Hidden -WorkingDirectory $tun
}

# 3) cloudflared tunnel
$cfAlive = Get-CimInstance Win32_Process -Filter "Name='cloudflared.exe'"
if ($cfAlive) {
    Write-Output "[3/4] cloudflared: already running"
} else {
    Write-Output "[3/4] cloudflared: starting..."
    Start-Process cmd.exe -ArgumentList "/c .\cloudflared.exe tunnel --url http://127.0.0.1:2323 --no-autoupdate --protocol http2 > tunnel.log 2>&1" -WindowStyle Hidden -WorkingDirectory $tun
}

# 4) watch-tunnel watchdog (self-healing loop)
$w = Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" | Where-Object { $_.CommandLine -match 'watch-tunnel' }
if ($w) {
    Write-Output "[4/4] watchdog: already running"
} else {
    Write-Output "[4/4] watchdog: starting..."
    Start-Process powershell.exe -ArgumentList "-ExecutionPolicy Bypass -File `"$tun\watch-tunnel.ps1`"" -WindowStyle Hidden -WorkingDirectory $tun
}

Write-Output "ensure-running done"
