// 本地egg项目校验，确保项目是egg.js项目，并且使用了egg-mongoose

import fs from 'fs';
import path from 'path';

export function validateProject(projectPath: string): void {
  const packageJsonPath = path.join(projectPath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('`package.json` not found in the specified directory.');
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  if (!dependencies.egg) {
    throw new Error(
      'This does not seem to be an egg.js project (`egg` not found in dependencies).',
    );
  }

  if (!dependencies['egg-mongoose']) {
    throw new Error(
      'This project does not seem to use `egg-mongoose` (`egg-mongoose` not found in dependencies).',
    );
  }
}
