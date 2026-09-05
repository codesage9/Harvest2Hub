@echo off
title Harvest2Hub (SIH 26032) Launcher
echo ========================================================
echo  Starting Harvest2Hub Platform (SIH Problem Statement 26032)
echo ========================================================
echo.

echo Starting Backend API on port 5000...
start "Harvest2Hub Backend" cmd /k "cd Backend && npm start"

echo Starting Frontend on port 5173...
start "Harvest2Hub Frontend" cmd /k "cd Frontend && npm run dev"

echo.
echo ========================================================
echo  Harvest2Hub is booting!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo ========================================================
pause
