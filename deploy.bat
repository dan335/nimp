@echo off
setlocal
REM Registry-free deploy for Windows cmd. Same steps as deploy.sh (which has
REM the full verification pass — prefer running that from Git Bash).

set SERVER=dan@104.236.39.83
set IMAGE=registry.gitlab.com/danphi/nimp:latest

docker build -t %IMAGE% --platform linux/x86_64 .
if %ERRORLEVEL% neq 0 exit /b 1

echo Streaming image to %SERVER%...
docker save %IMAGE% | ssh -C %SERVER% "docker load"
if %ERRORLEVEL% neq 0 exit /b 1

REM --force-recreate is required: compose's up-to-date check does not resolve
REM through the multi-arch manifest list buildx produces.
ssh %SERVER% "cd ~/server && docker compose up -d --force-recreate nimp"
if %ERRORLEVEL% neq 0 exit /b 1

echo === Done ===
