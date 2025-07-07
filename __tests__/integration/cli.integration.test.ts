// 集成测试，模拟egg-crud-generator命令行工具的执行
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const cliPath = path.resolve(__dirname, '../../dist/index.js');
const tempDir = path.resolve(__dirname, 'temp-egg-project');

// 创建一个临时的egg项目目录结构
const setupTempProject = () => {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });
  fs.writeFileSync(
    path.join(tempDir, 'package.json'),
    JSON.stringify({
      name: 'temp-project',
      dependencies: {
        egg: '^2.0.0',
        'egg-mongoose': '^3.0.0',
      },
    }),
  );
  fs.mkdirSync(path.join(tempDir, 'app'));
  fs.writeFileSync(path.join(tempDir, 'app/router.js'), "'use strict';");
};

describe('egg-crud-generator CLI Integration Test', () => {
  beforeAll(() => {
    // 运行构建，确保 CLI 是最新的
    execSync('npm run build');
    setupTempProject();
  });

  afterAll(() => {
    // 清理临时目录
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should generate all files correctly for a given config', () => {
    const configContent = {
      modelName: 'Book',
      routeName: 'book',
      fields: [{ name: 'title', type: 'String', required: true }],
    };
    const configPath = path.join(tempDir, 'book.json');
    fs.writeFileSync(configPath, JSON.stringify(configContent));

    // 执行CLI命令
    execSync(`node ${cliPath} g ${configPath} -p ${tempDir}`);

    // 检查文件是否已生成
    const controllerPath = path.join(tempDir, 'app/controller/book.js');
    const servicePath = path.join(tempDir, 'app/service/book.js');
    const modelPath = path.join(tempDir, 'app/model/book.js');

    expect(fs.existsSync(controllerPath)).toBe(true);
    expect(fs.existsSync(servicePath)).toBe(true);
    expect(fs.existsSync(modelPath)).toBe(true);

    // 检查文件内容是否包含关键信息
    const controllerContent = fs.readFileSync(controllerPath, 'utf-8');
    expect(controllerContent).toContain(
      'class BookController extends Controller',
    );

    const routerContent = fs.readFileSync(
      path.join(tempDir, 'app/router.js'),
      'utf-8',
    );
    expect(routerContent).toContain(
      "subRouter.resources('book', '/book', controller.book);",
    );
  });
});
