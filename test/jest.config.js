module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  maxWorkers: 3, // safe parallelism
  clearMocks: true,
  setupFilesAfterEnv: ['./helper/setupPerTestFile.ts'], // per-test-file setup
};
