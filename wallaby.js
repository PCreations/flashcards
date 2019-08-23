module.exports = function(w) {
  return {
    files: [
      'tsconfig.json',
      'src/**/*.ts',
      'features/*.feature',
      'features/dependencies.ts',
      'features/steps/*Steps.ts',
      'testsUtils/**/*.ts',
      '!features/steps/*.steps.ts',
      '!src/**/__tests__/*.ts',
    ],
    tests: ['src/**/__tests__/*.ts', 'features/steps/*.steps.ts'],
    env: {
      type: 'node',
      runner: 'node',
      params: {
        env: 'PLAYER_DEPS=src/adapters/inMemory/player;BOX_DEPS=src/adapters/inMemory/box',
      },
    },
    testFramework: 'jest',
    filesWithNoCoverageCalculated: ['features/**/*.ts'],
  };
};
