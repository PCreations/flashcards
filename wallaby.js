module.exports = () => ({
  files: ['src/**/*.js', '!**/__tests__/*.test.js'],
  tests: ['**/__tests__/*.test.js'],
  env: {
    type: 'node',
  },
  testFramework: 'jest',
});
