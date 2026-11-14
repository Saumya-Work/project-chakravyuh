@echo off
setlocal
cd /d "%~dp0"

echo ============================================================
echo   PROJECT CHAKRAVYUH (प्रोजेक्ट चक्रव्यूह) — DEMO LAUNCHER
echo   URL: http://localhost:3050
echo ============================================================
echo.

where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: npm was not found. Install Node.js and npm, then try again.
    pause
    exit /b 1
)

echo Checking if port 3050 is already in use...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$conns = Get-NetTCPConnection -LocalPort 3050 -State Listen -ErrorAction SilentlyContinue; if ($conns) { $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique; foreach ($p in $pids) { Write-Host ('Stopping existing server process on port 3050 (PID: ' + $p + ')...'); cmd /c ('taskkill /F /T /PID ' + $p) | Out-Null }; Start-Sleep -Seconds 2 }"

echo Starting Project Chakravyuh development server on port 3050...
start "Project Chakravyuh Demo Server" /D "%~dp0" cmd /k "npm run dev"
echo Waiting for http://localhost:3050 to become ready...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$deadline = (Get-Date).AddSeconds(60); do { try { $response = Invoke-WebRequest -Uri 'http://localhost:3050' -UseBasicParsing -TimeoutSec 2; if ($response.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Seconds 1 } while ((Get-Date) -lt $deadline); exit 1"
if errorlevel 1 (
    echo ERROR: The page did not respond within 60 seconds.
    echo Check the "Project Chakravyuh Demo Server" window for errors.
    pause
    exit /b 1
)

echo.
echo Project Chakravyuh Demo is READY! Opening http://localhost:3050 ...
start "" "http://localhost:3050"
echo Leave the "Project Chakravyuh Demo Server" window open while using the demo.
pause
