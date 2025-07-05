module.exports = {
  roots: ['<rootDir>/src'],
  // Coleção de caminhos que serão acompanhados pelo Jest
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-ports.js',
    '!**/ports/**',
    '!**/config/**',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',

};