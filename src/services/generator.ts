import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';
import { ModelConfig } from '../types/config'; // 假设你定义了类型

// 工具函数：将驼峰命名转为小写下划线
const toKebabCase = (str: string) =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export async function generateFiles(projectPath: string, config: ModelConfig) {
  const modelName = config.modelName;
  const modelNameLowerCase =
    modelName.charAt(0).toLowerCase() + modelName.slice(1);

  const templateData = {
    ...config,
    modelName,
    modelNameLowerCase,
    routeName: config.routeName || toKebabCase(modelName), // 优先使用配置文件中的routeName
    modelDescription: config.modelDescription || modelName, // 提供默认值
    specialControllers: config.specialControllers || [], // 提供默认值
    specialServices: config.specialServices || [], // 提供默认值
  };

  const templates = [
    { name: 'controller', path: `app/controller/${modelNameLowerCase}.js` },
    { name: 'service', path: `app/service/${modelNameLowerCase}.js` },
    { name: 'model', path: `app/model/${modelNameLowerCase}.js` },
    { name: 'router', append: true }, // Router需要追加内容
  ];

  for (const template of templates) {
    const templatePath = path.resolve(
      __dirname,
      `../templates/${template.name}.ejs`,
    );
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const renderedContent = ejs.render(templateContent, templateData);

    if (template.name === 'router') {
      const routerPath = path.join(projectPath, 'app/router.js');
      await fs.appendFile(routerPath, `\n${renderedContent}`);
    } else {
      const outputPath = path.join(projectPath, template.path as string);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, renderedContent);
    }
  }
}
