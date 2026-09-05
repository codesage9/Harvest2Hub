@echo off
title Harvest2Hub (SIH 26032) Database Seeder
echo ========================================================
echo  Seeding Harvest2Hub Database (SIH 26032)
echo ========================================================
cd Backend
node src/seed.js
pause
