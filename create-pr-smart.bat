@echo off
echo 🔧 إنشاء فرع جديد للمراجعة...
git checkout -b test-coderabbit

echo 📝 تعديل بسيط داخل src/test.js...
echo // تجربة مراجعة ذكية من CodeRabbit >> src/test.js

echo 💾 حفظ التعديلات...
git add .
git commit -m "Test CodeRabbit review"

echo 🚀 دفع الفرع إلى GitHub...
git push origin test-coderabbit

echo 🌐 افتح الرابط التالي لإنشاء PR:
echo https://github.com/mibra7697-svg/smart-souq-AI-final/compare/test-coderabbit...main
pause