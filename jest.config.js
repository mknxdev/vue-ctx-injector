module.exports = {
  verbose: true,
  rootDir: './',
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '\\.js$': ['babel-jest', {
      plugins: ['@babel/plugin-proposal-class-properties'],
    }],
    '.*\\.(vue)$': 'vue-jest',
  },

  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx}'
  ],
  coverageDirectory: '<rootDir>/tests/unit/_coverage',
  coverageThreshold: {
    global: {
      statements: 96.74,
      branches: 82.5,
      functions: 100,
      lines: 96.74,
    }
  },
}
