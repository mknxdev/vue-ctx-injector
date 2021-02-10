// Core
const path = require('path')
// Plugins
const TerserPlugin = require('terser-webpack-plugin')

// webpack config
module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './dist/'),
    publicPath: path.resolve(__dirname, './dist/'),
    filename: 'vue-ctx-injector.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/static/js/'),
    }
  },
  module: {
    rules: [
      // JS compilation
      //
      // Note: Target browsers list is available in the .browserslistrc file.
      // It is set to include all browsers supporting ES5.
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
    ]
  },
}
