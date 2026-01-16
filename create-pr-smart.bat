@echo off
setlocal

echo 🔧 إنشاء فرع جديد للمراجعة...
git checkout -b test-coderabbit

echo 📝 تعديل بسيط داخل src/test.js...
if not exist src (
    mkdir src
)
echo // تجربة مراجعة ذكية من CodeRabbit >> src\test.js

echo 💾 حفظ التعديلات...
git add .
git commit -m "Test CodeRabbit review"

echo 🚀 دفع الفرع إلى GitHub...
git push origin test-coderabbit

echo 🌐 فتح صفحة إنشاء الـ PR تلقائيًا...
start https://github.com/mibra7697-svg/smart-souq-AI-final/compare/test-coderabbit...main

echo 🎉 تم — افتح المتصفح الآن لإنشاء الـ PR وانتظر مراجعة CodeRabbit
pause