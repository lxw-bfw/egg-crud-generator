// 自动生成测试模板文件，支持交互式选择
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 创建readline接口
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// 交互式选择目录
function selectDirectory(rl) {
  return new Promise(resolve => {
    console.log('\n📁 请选择目录:');
    console.log('1. commands');
    console.log('2. services');

    rl.question('请输入选择 (1 或 2): ', answer => {
      const choice = parseInt(answer.trim());
      if (choice === 1) {
        resolve('commands');
      } else if (choice === 2) {
        resolve('services');
      } else {
        console.log('❌ 无效选择，请重新选择');
        selectDirectory(rl).then(resolve);
      }
    });
  });
}

// 交互式选择文件
function selectFile(rl, directory) {
  return new Promise(resolve => {
    const files = getTypescriptFiles(directory);

    if (files.length === 0) {
      console.log(`❌ 目录 ${directory} 中没有找到 TypeScript 文件`);
      resolve(null);
      return;
    }

    console.log(`\n📄 请选择 ${directory} 目录中的文件:`);
    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    rl.question(`请输入选择 (1-${files.length}): `, answer => {
      const choice = parseInt(answer.trim());
      if (choice >= 1 && choice <= files.length) {
        resolve(files[choice - 1]);
      } else {
        console.log('❌ 无效选择，请重新选择');
        selectFile(rl, directory).then(resolve);
      }
    });
  });
}

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node scripts/generate-test.js <mode> [options]');
    console.error('');
    console.error('Modes:');
    console.error(
      '  all                           - Generate tests for all files in commands and services',
    );
    console.error(
      '  single [directory] [name]     - Generate test for specific file (interactive if no args)',
    );
    console.error('');
    console.error('Examples:');
    console.error('  node scripts/generate-test.js all');
    console.error('  node scripts/generate-test.js single commands generate');
    console.error('  node scripts/generate-test.js single services validator');
    console.error(
      '  node scripts/generate-test.js single                    # 交互式选择',
    );
    process.exit(1);
  }

  const mode = args[0];

  if (mode === 'all') {
    return { mode: 'all' };
  } else if (mode === 'single') {
    if (args.length >= 3) {
      // 非交互式模式
      return {
        mode: 'single',
        interactive: false,
        directory: args[1],
        componentName: args[2],
      };
    } else {
      // 交互式模式
      return {
        mode: 'single',
        interactive: true,
      };
    }
  } else {
    console.error(`Unknown mode: ${mode}`);
    process.exit(1);
  }
}

// 获取目录中的所有TS文件
function getTypescriptFiles(dir) {
  const fullPath = path.join('src', dir);

  if (!fs.existsSync(fullPath)) {
    console.warn(`Directory ${fullPath} does not exist`);
    return [];
  }

  return fs
    .readdirSync(fullPath)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.basename(file, '.ts'));
}

// 分析文件导出的函数名
function getExportedFunctionName(directory, componentName) {
  const filePath = path.join('src', directory, `${componentName}.ts`);

  if (!fs.existsSync(filePath)) {
    console.warn(`文件 ${filePath} 不存在，使用默认导入名称`);
    return componentName.charAt(0).toUpperCase() + componentName.slice(1);
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // 匹配 export function 语句
    const exportFunctionMatch = fileContent.match(/export\s+function\s+(\w+)/);
    if (exportFunctionMatch) {
      return exportFunctionMatch[1];
    }

    // 匹配 export const 语句
    const exportConstMatch = fileContent.match(/export\s+const\s+(\w+)/);
    if (exportConstMatch) {
      return exportConstMatch[1];
    }

    // 匹配 export { functionName }
    const exportBracesMatch = fileContent.match(/export\s*\{\s*(\w+)\s*\}/);
    if (exportBracesMatch) {
      return exportBracesMatch[1];
    }

    // 如果没有找到导出函数，返回默认名称
    console.warn(`在文件 ${filePath} 中未找到导出函数，使用默认导入名称`);
    return componentName.charAt(0).toUpperCase() + componentName.slice(1);
  } catch (error) {
    console.warn(`读取文件 ${filePath} 时出错:`, error.message);
    return componentName.charAt(0).toUpperCase() + componentName.slice(1);
  }
}

// 生成测试模板
function generateTestTemplate(directory, componentName) {
  const exportedFunctionName = getExportedFunctionName(
    directory,
    componentName,
  );

  return `import { ${exportedFunctionName} } from '../src/${directory}/${componentName}';

describe('${exportedFunctionName}', () => {
  it('should work as expected', () => {
    // TODO: Write your test case here
    expect(true).toBe(true);
  });
  
  // TODO: Add more test cases based on the actual implementation
});
`;
}

// 创建单个测试文件
function createTestFile(directory, componentName) {
  const testFilePath = path.join('__tests__', `${componentName}.test.ts`);

  if (fs.existsSync(testFilePath)) {
    console.warn(`Test file ${testFilePath} already exists, skipping...`);
    return false;
  }

  // 确保__tests__目录存在
  if (!fs.existsSync('__tests__')) {
    fs.mkdirSync('__tests__');
  }

  const testTemplate = generateTestTemplate(directory, componentName);
  fs.writeFileSync(testFilePath, testTemplate);

  console.log(`✅ Created test file: ${testFilePath}`);
  return true;
}

// 主函数
async function main() {
  const args = parseArgs();

  if (args.mode === 'all') {
    console.log(
      '🚀 Generating tests for all files in commands and services...',
    );

    const directories = ['commands', 'services'];
    let totalCreated = 0;

    directories.forEach(dir => {
      console.log(`\n📁 Processing ${dir} directory...`);
      const files = getTypescriptFiles(dir);

      if (files.length === 0) {
        console.log(`   No TypeScript files found in ${dir}`);
        return;
      }

      files.forEach(file => {
        if (createTestFile(dir, file)) {
          totalCreated++;
        }
      });
    });

    console.log(`\n🎉 Successfully created ${totalCreated} test files!`);
  } else if (args.mode === 'single') {
    if (args.interactive) {
      // 交互式模式
      const rl = createReadlineInterface();

      try {
        console.log('🚀 交互式测试文件生成器');

        // 选择目录
        const directory = await selectDirectory(rl);
        console.log(`✅ 已选择目录: ${directory}`);

        // 选择文件
        const componentName = await selectFile(rl, directory);

        if (!componentName) {
          console.log('❌ 操作取消');
          process.exit(1);
        }

        console.log(`✅ 已选择文件: ${componentName}`);
        console.log(
          `\n🚀 Generating test for ${directory}/${componentName}...`,
        );

        if (createTestFile(directory, componentName)) {
          console.log('🎉 Test file created successfully!');
        } else {
          console.log('❌ Failed to create test file');
          process.exit(1);
        }
      } catch (error) {
        console.error('❌ 发生错误:', error.message);
        process.exit(1);
      } finally {
        rl.close();
      }
    } else {
      // 非交互式模式
      console.log(
        `🚀 Generating test for ${args.directory}/${args.componentName}...`,
      );

      if (createTestFile(args.directory, args.componentName)) {
        console.log('🎉 Test file created successfully!');
      } else {
        console.log('❌ Failed to create test file');
        process.exit(1);
      }
    }
  }
}

main().catch(error => {
  console.error('❌ 程序执行出错:', error);
  process.exit(1);
});
