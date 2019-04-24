module.exports = function(w) {
  return {
    files: ['tsconfig.json', 'src/**/*.ts', 'testsUtils/**/*.ts', '!src/**/__tests__/*.ts'],
    tests: ['src/**/__tests__/*.ts'],
    env: {
      type: 'node',
      runner: 'node',
    },
    testFramework: 'jest',
    filesWithNoCoverageCalculated: ['features/**/*.ts', 'testUtils/**/*.ts'],
  };
};
