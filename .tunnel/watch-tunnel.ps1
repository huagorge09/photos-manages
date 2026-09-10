# ============================================================
# VisionFlow AI - Tunnel Watchdog (self-healing)
# Checks serveo + cloudflared tunnels every 30s.
# If a tunnel dies, restarts it (new random URL is picked up).
# Writes the latest working URLs to .tunnel\current-url.txt
# Also restarts the dev server if it goes down.
# Run:  powershell -ExecutionPolicy Bypass -File watch-tunnel.ps1
# ============================================================
$ErrorActionPreference = 'SilentlyContinue'
$root = Split-Path -Parent $PSScriptRoot
$tun = "$root\.tunnel"
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0"
$log = "$tun\watchdog.log"

function Log($msg) {
    $line = "$(Get-Date -Format 'HH:mm:ss') $msg"
    Add-Content -Path $log -Value $line -Encoding UTF8
    Write-Host $line -ForegroundColor Cyan
}

function Get-ServeoUrl {
    $m = Select-String -Path "$tun\serveo.log" -Pattern "https://[a-z0-9-]+\.serveousercontent\.com" | Select-Object -Last 1
    if ($m) { return $m.Matches[0].Value }
    return $null
}

function Get-CfUrl {
    $m = Select-String -Path "$tun\tunnel.log" -Pattern "https://[a-z0-9-]+\.trycloudflare\.com" | Select-Object -Last 1
    if ($m) { return $m.Matches[0].Value }
    return $null
}

function Test-Url($u) {
    if (-not $u) { return $false }
    $code = curl.exe -s -o NUL -w "%{http_code}" -m 12 -H "User-Agent: $ua" "$u" 2>$null
    $code = ($code -as [string]).Trim()
    return ($code -eq '200' -or $code -eq '304')
}

function Start-Serveo {
    Start-Process cmd.exe -ArgumentList "/c echo y | ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -R 80:localhost:2323 serveo.net > serveo.log 2>&1" -WindowStyle Hidden -WorkingDirectory $tun
}

function Start-Cf {
    Start-Process cmd.exe -ArgumentList "/c .\cloudflared.exe tunnel --url http://127.0.0.1:2323 --no-autoupdate --protocol http2 > tunnel.log 2>&1" -WindowStyle Hidden -WorkingDirectory $tun
}

function Start-Dev {
    Start-Process cmd.exe -ArgumentList "/c pnpm dev > dev.log 2>&1" -WindowStyle Hidden -WorkingDirectory $root
}

Log "Watchdog started"

while ($true) {
    # 1) dev server
    if (-not (Get-NetTCPConnection -LocalPort 2323 -State Listen)) {
        Log "dev server down, restarting"
        Start-Dev
        Start-Sleep -Seconds 8
    }

    # 2) serveo
    $su = Get-ServeoUrl
    if (-not (Test-Url $su)) {
        Log "serveo tunnel down ($su), restarting"
        Get-CimInstance Win32_Process -Filter "Name='ssh.exe'" | Where-Object { $_.CommandLine -match 'serveo' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
        Start-Sleep -Seconds 2
        Start-Serveo
        Start-Sleep -Seconds 14
        $su = Get-ServeoUrl
        if ($su) { Log "serveo new url: $su" }
    }

    # 3) cloudflared
    $cu = Get-CfUrl
    if (-not (Test-Url $cu)) {
        Log "cloudflared tunnel down ($cu), restarting"
        Get-CimInstance Win32_Process -Filter "Name='cloudflared.exe'" | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
        Start-Sleep -Seconds 2
        Start-Cf
        Start-Sleep -Seconds 14
        $cu = Get-CfUrl
        if ($cu) { Log "cloudflared new url: $cu" }
    }

    # 4) write current urls
    $lines = @()
    if ($su) { $lines += "serveo: $su" }
    if ($cu) { $lines += "cloudflared: $cu" }
    $lan = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254*' } | Select-Object -First 1).IPAddress
    if ($lan) { $lines += "lan: http://${lan}:2323" }
    Set-Content -Path "$tun\current-url.txt" -Value $lines -Encoding UTF8

    Start-Sleep -Seconds 30
}
