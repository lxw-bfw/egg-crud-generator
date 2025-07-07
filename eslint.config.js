const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  {
    // 全局忽略配置
    ignores: [
      'dist/**',
      'node_modules/**',
      '.husky/**',
      '.vscode/**',
      '.git/**',
      '.gitignore',
      '.prettierrc',
      '.prettierignore',
      '*.ejs',
      'src/templates/**',
      'eslint.config.js',
      'scripts/**',
      '__tests__/**',
    ],
  },
  {
    // TypeScript 文件配置
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // 使用推荐的 TypeScript 规则
      ...typescriptEslint.configs.recommended.rules,

      // 自定义规则
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // JavaScript 文件配置
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // 基本的 JavaScript 规则
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off', // 允许 console.log（CLI 工具需要）
    },
  },
];
