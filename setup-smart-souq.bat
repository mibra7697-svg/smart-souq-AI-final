@echo off
echo 🔧 تثبيت Node.js...
powershell -Command "Invoke-WebRequest 'https://nodejs.org/dist/v22.12.0/node-v22.12.0-x64.msi' -OutFile 'node.msi'; Start-Process 'msiexec.exe' -ArgumentList '/i node.msi /qn' -Wait; Remove-Item 'node.msi'"

echo ✅ Node.js تم تثبيته

echo 🔧 تثبيت pm2...
npm install -g pm2

echo 🔧 تثبيت الحزم للواجهة...
cd /d "%~dp0"
npm install

echo 🔧 تشغيل بيئة التطوير...
npm run dev

echo 🔧 تشغيل backend...
cd crypto-payment-service
npm install
pm2 start server.js --name smart-backend
cd ..

echo 🎉 تم تشغيل المشروع بنجاح في بيئة التطوير
pause