const path = require('path');

module.exports = {
  entry: './assets/js/src/index.js',
  output: {
    path: path.resolve(__dirname, 'assets/js'),
    filename: 'demoit.js'
  },
  mode: 'development',
  watch: true,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  }
};