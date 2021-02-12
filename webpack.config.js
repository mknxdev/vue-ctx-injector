// Core
const path = require('path')
// Plugins
const TerserPlugin = require('terser-webpack-plugin')

// webpack config
module.exports = {
  entry: './index.js',
  output: {
    library: 'VueCtxInjector',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, './dist/'),
    publicPath: path.resolve(__dirname, './dist/'),
    filename: 'vue-ctx-injector.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties'],
            }
          },
        ]
      },
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
    ],
  },
}
