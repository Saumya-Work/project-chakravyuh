@echo off
setlocal
cd /d "%~dp0"

echo Project Chakravyuh Demo
echo URL: http://localhost:3050
echo.

where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: npm was not found. Install Node.js and npm, then try again.
    pause
    exit /b 1
)

powershell -NoProfile -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3050' -UseBasicParsing -TimeoutSec 2; if ($response.StatusCode -eq 200) { exit 0 } } catch { exit 1 }; exit 1"
if not errorlevel 1 (
    echo A service is already responding at the URL above. Opening it now.
    start "" "http://localhost:3050"
    pause
    exit /b 0
)

echo Starting the development server in a new window...
start "Project Chakravyuh Demo Server" /D "%~dp0" cmd /k "npm run dev"
echo Waiting for the page to become available...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$deadline = (Get-Date).AddSeconds(60); do { try { $response = Invoke-WebRequest -Uri 'http://localhost:3050' -UseBasicParsing -TimeoutSec 2; if ($response.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Seconds 1 } while ((Get-Date) -lt $deadline); exit 1"
if errorlevel 1 (
    echo ERROR: The page did not respond within 60 seconds.
    echo Check the server window for errors.
    pause
    exit /b 1
)

echo.
echo The demo is ready. Open: http://localhost:3050
start "" "http://localhost:3050"
echo Leave the server window open while using the demo.
pause
