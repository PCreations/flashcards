module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/features'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/steps/*.steps.ts', '**/__tests__/**/*.test.ts'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['<rootDir>/features']
};
