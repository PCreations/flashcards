module.exports = function (w) {
  return {
    files: [
      'tsconfig.json',
      'src/**/*.ts',
      'features/*.feature',
      'features/steps/*Steps.ts',
      'testsUtils/**/*.ts',
      '!features/steps/*.steps.ts',
      '!src/**/__tests__/*.ts',
    ],
    tests: ['src/**/__tests__/*.ts', 'features/steps/*.steps.ts'],
    env: {
      type: 'node',
      runner: 'node',
    },
    testFramework: 'jest',
    filesWithNoCoverageCalculated: ['features/**/*.ts'],
  };
};
