#!/bin/bash

echo "🔧 تحديث النظام وتثبيت الأدوات..."
sudo apt update
sudo apt install -y nginx nodejs npm
sudo npm install -g pm2

echo "📦 تثبيت الحزم للواجهة..."
cd ~/smart-souq-AI
npm install
npm run build

echo "🚀 تشغيل backend..."
cd crypto-payment-service
npm install
pm2 start server.js --name smart-backend
cd ..

echo "🌐 إعداد Nginx..."
sudo tee /etc/nginx/sites-available/smart-souq > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/smart-souq;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3002/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/smart-souq /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

echo "📁 نقل ملفات الواجهة..."
sudo mkdir -p /var/www/smart-souq
sudo cp -r dist/* /var/www/smart-souq

echo "✅ تم إطلاق المشروع بنجاح على VPS"