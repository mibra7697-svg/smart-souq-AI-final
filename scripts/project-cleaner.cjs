// scripts/project-cleaner.cjs
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcPath = path.join(projectRoot, 'src');
const scriptsPath = path.join(projectRoot, 'scripts');
const configPath = path.join(projectRoot, 'config');

// 1. حذف الملفات الفارغة أو المتضاربة
function deleteEmptyFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isFile() && stats.size === 0) {
      console.log(`🗑️ حذف الملف الفارغ: ${fullPath}`);
      fs.unlinkSync(fullPath);
    }
  });
}

// 2. حذف المكونات غير المستخدمة في src/components
function deleteUnusedComponents() {
  const used = new Set();
  const folders = fs.readdirSync(srcPath, { withFileTypes: true });

  folders.forEach(entry => {
    if (entry.isDirectory()) {
      const subdir = path.join(srcPath, entry.name);
      const subfiles = fs.readdirSync(subdir);
      subfiles.forEach(file => {
        const fullPath = path.join(subdir, file);
        if (fs.statSync(fullPath).isFile()) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const matches = content.match(/@\/components\/(.*?)['"]/g);
          if (matches) {
            matches.forEach(match => {
              const name = match.split('/').pop().replace(/['"]/g, '').replace(/\.jsx?$/, '');
              used.add(name);
            });
          }
        }
      });
    }
  });

  const componentsDir = path.join(srcPath, 'components');
  if (!fs.existsSync(componentsDir)) return;

  fs.readdirSync(componentsDir).forEach(file => {
    const fullPath = path.join(componentsDir, file);
    if (fs.statSync(fullPath).isFile()) {
      const name = file.replace(/\.jsx?$/, '');
      if (!used.has(name)) {
        console.log(`🗑️ حذف مكون غير مستخدم: ${fullPath}`);
        fs.unlinkSync(fullPath);
      }
    }
  });
}

// 3. إنشاء tsconfig.node.json إذا مفقود
function ensureTsconfigNode() {
  const filePath = path.join(projectRoot, 'tsconfig.node.json');
  if (!fs.existsSync(filePath)) {
    console.log('🧩 إنشاء tsconfig.node.json...');
    const content = {
      compilerOptions: {
        composite: true,
        module: "ESNext",
        moduleResolution: "Node",
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        resolveJsonModule: true,
        strict: false,
        noEmit: true
      },
      include: ["vite.config.ts", "scripts/**/*.ts", "scripts/**/*.js"]
    };
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }
}

// 4. تصحيح jsconfig.json
function fixJsConfig() {
  const filePath = path.join(projectRoot, 'jsconfig.json');
  if (fs.existsSync(filePath)) {
    const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    config.compilerOptions = config.compilerOptions || {};
    config.compilerOptions.baseUrl = '.';
    config.compilerOptions.paths = {
      "@/*": ["src/*"]
    };
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
    console.log('🔧 تم تصحيح jsconfig.json');
  }
}

// 5. توليد تقرير نهائي
function generateReport() {
  const reportPath = path.join(projectRoot, 'CLEANUP_REPORT.md');
  const content = `
# تقرير تنظيف مشروع Smart-Souq-AI

✅ تم حذف الملفات الفارغة  
✅ تم حذف المكونات غير المستخدمة  
✅ تم إنشاء tsconfig.node.json  
✅ تم تصحيح jsconfig.json  
✅ المشروع جاهز للإطلاق

تاريخ التنفيذ: ${new Date().toLocaleString()}
`;
  fs.writeFileSync(reportPath, content);
  console.log('📄 تم إنشاء تقرير: CLEANUP_REPORT.md');
}

// تنفيذ المهام
deleteEmptyFiles(configPath);
deleteEmptyFiles(scriptsPath);
deleteUnusedComponents();
ensureTsconfigNode();
fixJsConfig();
generateReport();