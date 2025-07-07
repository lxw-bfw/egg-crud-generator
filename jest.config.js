// jest.config.js
module.exports = {
  preset: 'ts-jest', // 使用 ts-jest 来处理 TypeScript 文件
  testEnvironment: 'node', // 指定测试环境为 Node.js
  testMatch: ['**/__tests__/**/*.test.ts'], // 只匹配 __tests__ 目录下的 .test.ts 文件
  collectCoverage: true, // 开启测试覆盖率收集
  coverageDirectory: 'coverage', // 指定覆盖率报告的输出目录
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // 覆盖率报告的格式
};
