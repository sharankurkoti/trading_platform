@echo off
setlocal enabledelayedexpansion

REM Set your Docker Hub username
set USERNAME=sharankurkoti

REM Set the base directory for your services
set BASE_DIR=E:\TradeProject1\trading-platform\trading-backend

REM List of service folders (must match folder names)
set SERVICES=loc-service trade-exchange-service user-service finance-service

REM Login to Docker Hub
echo === Docker Login ===
docker login
IF %ERRORLEVEL% NEQ 0 (
    echo Docker login failed. Exiting.
    exit /b 1
)

REM Loop through and build/push each service
for %%S in (%SERVICES%) do (
    echo.
    echo === Building and Pushing: %%S ===
    cd /d "%BASE_DIR%\%%S"

    docker build -t %USERNAME%/%%S:latest .
    if !ERRORLEVEL! NEQ 0 (
        echo ❌ Failed to build %%S. Skipping push.
    ) else (
        docker push %USERNAME%/%%S:latest
        if !ERRORLEVEL! NEQ 0 (
            echo ❌ Failed to push %%S.
            exit /b 1
        )
    )
)

echo.
echo ✅ All services built and pushed (or skipped if build failed)!
endlocal
pause