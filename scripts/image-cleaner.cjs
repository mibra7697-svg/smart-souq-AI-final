// scripts/image-cleaner.cjs
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'public', 'assets');
const srcDir = path.join(projectRoot, 'src');

function getAllImageFiles(dir) {
  return fs.readdirSync(dir).filter(file =>
    /\.(png|jpe?g|gif|svg|webp)$/i.test(file)
  );
}

function getAllProjectFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllProjectFiles(fullPath));
    } else if (/\.(js|jsx|ts|tsx|html|css)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function findUnusedImages() {
  const images = getAllImageFiles(assetsDir);
  const projectFiles = getAllProjectFiles(srcDir);
  const usedImages = new Set();

  for (const file of projectFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    images.forEach(img => {
      if (content.includes(img)) {
        usedImages.add(img);
      }
    });
  }

  const unused = images.filter(img => !usedImages.has(img));
  return unused;
}

function deleteUnusedImages(unusedImages) {
  unusedImages.forEach(img => {
    const fullPath = path.join(assetsDir, img);
    fs.unlinkSync(fullPath);
    console.log(`🗑️ حذف صورة غير مستخدمة: ${img}`);
  });
}

function generateImageReport(unusedImages) {
  const reportPath = path.join(projectRoot, 'UNUSED_IMAGES_REPORT.md');
  const content = `
# تقرير الصور غير المستخدمة

${unusedImages.length === 0 ? '✅ لا توجد صور غير مستخدمة' : '🖼️ الصور التالية لم تُستخدم في أي ملف:'}

${unusedImages.map(img => `- ${img}`).join('\n')}

تاريخ الفحص: ${new Date().toLocaleString()}
`;
  fs.writeFileSync(reportPath, content);
  console.log('📄 تم إنشاء تقرير: UNUSED_IMAGES_REPORT.md');
}

// تنفيذ
const unusedImages = findUnusedImages();
generateImageReport(unusedImages);

// إذا أردت الحذف التلقائي، فعّل السطر التالي:
deleteUnusedImages(unusedImages);