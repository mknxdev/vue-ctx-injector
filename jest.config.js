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
  },

  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx}'
  ],
  coverageDirectory: '<rootDir>/tests/unit/_coverage',
  // coverageThreshold: {
  //   global: {
  //     statements: 62,
  //     branches: 53,
  //     functions: 67,
  //     lines: 63
  //   }
  // },
}
