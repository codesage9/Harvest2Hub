@echo off
title Krishi-Setu (SIH 26032) Launcher
echo ========================================================
echo  Starting Krishi-Setu Platform (SIH Problem Statement 26032)
echo ========================================================
echo.

echo Starting Backend API on port 5000...
start "Krishi-Setu Backend" cmd /k "cd Backend && npm start"

echo Starting Frontend on port 5173...
start "Krishi-Setu Frontend" cmd /k "cd Frontend && npm run dev"

echo.
echo ========================================================
echo  Krishi-Setu is booting!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo ========================================================
pause
