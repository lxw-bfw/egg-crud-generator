import type { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { validateProject } from '../services/validator';
import { generateFiles } from '../services/generator';

export function generateCommand(program: Command) {
  program
    .command('generate <configFile>')
    .alias('g')
    .description('Generate CRUD files based on a JSON config file')
    .option(
      '-p, --project <projectPath>',
      'The path to your egg.js project',
      process.cwd(),
    )
    .action(async (configFile, options) => {
      console.log(chalk.cyan('🚀 Starting code generation...'));

      const projectPath = path.resolve(options.project);
      const configFilePath = path.resolve(configFile);

      // 1. 校验项目目录
      try {
        validateProject(projectPath);
        console.log(
          chalk.green(`✅ Project validation passed for: ${projectPath}`),
        );
      } catch (error) {
        console.error(
          chalk.red(
            `❌ Project validation failed: ${(error as Error).message}`,
          ),
        );
        process.exit(1);
      }

      // 2. 读取和解析JSON配置文件
      let modelConfig;
      try {
        const configFileContent = fs.readFileSync(configFilePath, 'utf-8');
        modelConfig = JSON.parse(configFileContent);
        console.log(
          chalk.green(`✅ Successfully read config file: ${configFile}`),
        );
      } catch (error) {
        console.error(
          chalk.red(
            `❌ Error reading or parsing config file: ${(error as Error).message}`,
          ),
        );
        process.exit(1);
      }

      // 3. 调用代码生成服务
      try {
        await generateFiles(projectPath, modelConfig);
        console.log(
          chalk.green.bold(
            `🎉 Successfully generated all files for model: ${modelConfig.modelName}`,
          ),
        );
      } catch (error) {
        console.error(
          chalk.red(`❌ Code generation failed: ${(error as Error).message}`),
        );
        process.exit(1);
      }
    });
}
