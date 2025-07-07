#!/usr/bin/env node
import { Command } from 'commander';
import { generateCommand } from './commands/generate';

// 创建主命令
const program = new Command();

program
  .name('egg-gen')
  .description('A CLI tool to auto-generate files for egg.js')
  .version('1.0.0');

// 注册generate子命令
generateCommand(program);

// 解析命令行参数
program.parse(process.argv);
