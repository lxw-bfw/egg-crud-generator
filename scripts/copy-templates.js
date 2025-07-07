const fs = require('fs');
const path = require('path');

// 递归复制目录
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);

  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// 复制模板文件
const srcDir = path.join(__dirname, '../src/templates');
const destDir = path.join(__dirname, '../dist/templates');

if (fs.existsSync(srcDir)) {
  copyDir(srcDir, destDir);
  console.log('✅ Templates copied successfully!');
} else {
  console.warn('⚠️  Source templates directory not found:', srcDir);
}
