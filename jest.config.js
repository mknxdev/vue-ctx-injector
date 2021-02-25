module.exports = {
  verbose: true,
  rootDir: './',
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    "\\.js$": "babel-jest",
  },
}
