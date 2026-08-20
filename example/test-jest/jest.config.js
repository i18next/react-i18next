export default {
  testEnvironment: 'jsdom',
  // roots must include src so src/__mocks__/react-i18next.js auto-mocks the package
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|svg)$': '<rootDir>/src/test-utils/fileMock.js',
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};
