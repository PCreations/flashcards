module.exports = function(config) {
  config.set({
    mutator: 'typescript',
    packageManager: 'yarn',
    reporters: ['clear-text', 'progress'],
    testRunner: 'jest',
    commandRunner: {
      command: 'yarqsdsdqsdn test:unit',
    },
    transpilers: [],
    coverageAnalysis: 'off',
    tsconfigFile: 'tsconfig.json',
    mutate: ['src/**/*.ts'],
  });
};
