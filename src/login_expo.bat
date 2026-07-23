@echo off
title Dang Nhap Expo
cd /d "%~dp0"
call npx --yes eas-cli login
pause
