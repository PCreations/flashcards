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
        env:
          'AUTHENTICATION_GATEWAY=src/adapters/inMemory/authenticationGateway;BOX_REPOSITORY=src/adapters/inMemory/boxRepository',
      },
    },
    testFramework: 'jest',
    filesWithNoCoverageCalculated: ['features/**/*.ts'],
  };
};
