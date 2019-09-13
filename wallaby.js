module.exports = () => ({
  files: ['src/**/*.js', 'features/*.feature', '!src/**/__tests__/*.test.js', '!features/steps/*.steps.js'],
  tests: ['src/**/__tests__/*.test.js', 'features/steps/*.steps.js'],
  env: {
    type: 'node',
  },
  testFramework: 'jest',
  filesWithNoCoverageCalculated: ['features/**/*.js'],
});
