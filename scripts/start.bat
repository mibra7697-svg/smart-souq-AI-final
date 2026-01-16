@echo off
chcp 65001 >nul
echo.
echo ===============================================
echo     🚀 تشغيل مشروع سوق سمارت - Smart Souq 🚀
echo ===============================================
echo.

REM تحديد مسار المشروع
set "PROJECT_ROOT=%~dp0"
cd /d "%PROJECT_ROOT%"

echo 📍 الموقع الحالي: %CD%
echo.

REM التحقق من إصدار Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js غير مثبت على جهازك!
    echo.
    echo 📥 الرجاء تثبيت Node.js من الموقع الرسمي:
    echo 🔗 https://nodejs.org/
    echo.
    echo 💡 اختر الإصدار LTS (المستقر)
    pause
    exit /b 1
)

REM عرض إصدار Node.js
for /f "tokens=*" %%v in ('node --version') do set "NODE_VERSION=%%v"
echo ✅ إصدار Node.js: %NODE_VERSION%
echo.

REM تنظيف المشروع
echo 🧹 جاري تنظيف المشروع...
echo.
if exist "node_modules" (
    echo ⏳ حذف مجلد node_modules...
    rmdir /s /q "node_modules" 2>nul
    if %errorlevel% equ 0 (
        echo ✅ تم حذف node_modules
    ) else (
        echo ⚠️  تعذر حذف node_modules، سيتم تجاوز الخطوة
    )
)

if exist "package-lock.json" (
    echo ⏳ حذف package-lock.json...
    del /f /q "package-lock.json" 2>nul
    echo ✅ تم حذف package-lock.json
)

if exist "yarn.lock" (
    echo ⏳ حذف yarn.lock...
    del /f /q "yarn.lock" 2>nul
    echo ✅ تم حذف yarn.lock
)

echo.
echo 📦 جاري تثبيت المكتبات المطلوبة...
echo ⏳ قد يستغرق هذا بضع دقائق...
echo.

REM تثبيت المكتبات
call npm install --verbose

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: فشل تثبيت المكتبات!
    echo.
    echo 🔍 الأسباب المحتملة:
    echo 1. 🔌 مشكلة في اتصال الإنترنت
    echo 2. 💾 مساحة تخزين غير كافية
    echo 3. 🔐 مشكلة في الأذونات
    echo.
    echo 💡 الحلول المقترحة:
    echo 1. تحقق من اتصال الإنترنت
    echo 2. حاول تشغيل CMD كمسؤول
    echo 3. جرب الأمر: npm cache clean --force
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ تم تثبيت المكتبات بنجاح!
echo.

REM التحقق من الملفات الأساسية
echo 🔍 جاري التحقق من الملفات الأساسية...
echo.

set "ERROR_COUNT=0"
set "WARNING_COUNT=0"

if not exist "package.json" (
    echo ❌ ERROR: ملف package.json غير موجود!
    set /a ERROR_COUNT+=1
) else (
    echo ✅ package.json موجود
)

if not exist "public\index.html" (
    echo ⚠️  WARNING: ملف public\index.html غير موجود
    set /a WARNING_COUNT+=1
) else (
    echo ✅ public/index.html موجود
)

if not exist "src\App.jsx" (
    echo ⚠️  WARNING: ملف src\App.jsx غير موجود
    set /a WARNING_COUNT+=1
) else (
    echo ✅ src/App.jsx موجود
)

if not exist "src\index.js" (
    echo ⚠️  WARNING: ملف src\index.js غير موجود
    set /a WARNING_COUNT+=1
) else (
    echo ✅ src/index.js موجود
)

if not exist "config\tailwind.config.js" (
    if exist "tailwind.config.js" (
        echo ℹ️  INFO: tailwind.config.js موجود في المجلد الرئيسي
    ) else (
        echo ⚠️  WARNING: ملف tailwind.config.js غير موجود
        set /a WARNING_COUNT+=1
    )
) else (
    echo ✅ config/tailwind.config.js موجود
)

echo.
if %ERROR_COUNT% GTR 0 (
    echo ❌ تم العثور على %ERROR_COUNT% أخطاء!
    pause
    exit /b 1
)

if %WARNING_COUNT% GTR 0 (
    echo ⚠️  تم العثور على %WARNING_COUNT% تحذيرات
    echo.
    echo 💡 يمكن أن يعمل المشروع مع هذه التحذيرات
    echo.
    timeout /t 3 /nobreak >nul
)

REM التحقق من المنافذ
echo 🔌 جاري التحقق من المنافذ المتاحة...
echo.

set "PORT=3002"
set "PORT_FOUND=0"

for /f "tokens=5" %%p in ('netstat -ano ^| findstr :%PORT%') do (
    set "PORT_FOUND=1"
    echo ⚠️  المنفذ %PORT% قيد الاستخدام من قبل PID: %%p
)

if %PORT_FOUND% equ 1 (
    echo.
    echo 🔄 سيحاول المشروع استخدام منفذ آخر (3001, 3002, ...)
    echo.
    timeout /t 2 /nobreak >nul
)

REM عرض معلومات المشروع
echo 📊 معلومات المشروع:
echo.

for /f "tokens=2 delims=:," %%a in ('type package.json ^| findstr /i "\"name\""') do set "PROJECT_NAME=%%a"
for /f "tokens=2 delims=:," %%b in ('type package.json ^| findstr /i "\"version\""') do set "PROJECT_VERSION=%%b"

set "PROJECT_NAME=%PROJECT_NAME:"=%
set "PROJECT_VERSION=%PROJECT_VERSION:"=%
set "PROJECT_NAME=%PROJECT_NAME: =%
set "PROJECT_VERSION=%PROJECT_VERSION: =%

echo 📛 اسم المشروع: %PROJECT_NAME%
echo 🏷️  الإصدار: %PROJECT_VERSION%
echo 📁 المجلد: %CD%
echo.

REM بدء التشغيل
echo ===============================================
echo     ⚡ جاري تشغيل مشروع سوق سمارت... ⚡
echo ===============================================
echo.
echo 📌 معلومات هامة:
echo.
echo 🌐 سيفتح المتصفح تلقائياً على: http://localhost:%PORT%
echo ⏱️  قد يستغرق بدء التشغيل من 30 إلى 90 ثانية
echo 🔧 لا تغلق نافذة الأوامر أثناء التشغيل
echo 📋 لعرض معلومات مفصلة، راجع README.md
echo.
echo 🛑 لإيقاف التشغيل:
echo 1. اضغط على Ctrl + C
echo 2. اكتب Y ثم اضغط Enter
echo.
echo ===============================================
echo.

REM تشغيل المشروع
echo ⏳ يبدأ التشغيل الآن... يرجى الانتظار
echo.

call npm start

REM بعد إيقاف التشغيل
echo.
echo ✅ تم إيقاف تشغيل المشروع بنجاح
echo.
echo 💡 نصيحة: يمكنك إعادة التشغيل بكتابة:
echo npm start
echo.
pause