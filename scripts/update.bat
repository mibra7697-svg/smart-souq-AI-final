@echo off
chcp 65001 >nul
echo.
echo ===============================================
echo     🔄 تحديث مكتبات سوق سمارت
echo ===============================================
echo.

set "PROJECT_ROOT=%~dp0.."
cd /d "%PROJECT_ROOT%"

echo 📍 الموقع: %CD%
echo.

echo 📊 حالة المكتبات الحالية:
echo.
npm list --depth=0

echo.
set /p CONFIRM=هل تريد تحديث جميع المكتبات؟ (y/n): 
if /i not "%CONFIRM%"=="y" (
    echo ❌ تم إلغاء التحديث
    timeout /t 2 /nobreak >nul
    exit /b 0
)

echo.
echo 🔄 جاري تحديث المكتبات...
echo ⏳ قد يستغرق هذا بضع دقائق...
echo.

REM تحديث المكتبات
call npm update

if %errorlevel% neq 0 (
    echo.
    echo ❌ فشل تحديث المكتبات
    echo.
    echo 💡 حاول تشغيل الأمر التالي يدوياً:
    echo npm audit fix
    pause
    exit /b 1
)

echo.
echo 📊 حالة المكتبات بعد التحديث:
echo.
npm list --depth=0

echo.
echo ✅ تم تحديث المكتبات بنجاح!
echo.
pause