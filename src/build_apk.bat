@echo off
title Expo EAS Build APK
echo ===================================================
echo KHOI DONG TIEN TRINH BUILD APK EXPO
echo ===================================================
echo.
cd /d "%~dp0"
echo [1/2] Dang nhap tai khoan Expo (nhap chanhda neu duoc hoi)...
call npx --yes eas-cli login
echo.
echo [2/2] Dang tien hanh Build APK...
call npx --yes eas-cli build --platform android --profile preview
echo.
echo ===================================================
echo HOAN THANH TEIN TRINH BUILD!
echo ===================================================
pause
