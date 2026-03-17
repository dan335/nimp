module.exports = {
  testEnvironment: 'node',
  transform: {
    '\\.[jt]sx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
      ],
    }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__tests__/helpers/fileMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/helpers/'],
  fakeTimers: { enableGlobally: false },
};
