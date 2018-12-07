const path = require('path');

module.exports = {
  entry: [
    './src/js/index.js'
  ],
  output: {
    path: path.resolve(__dirname, '.tmp'),
    filename: 'demoit.js'
  },
  mode: 'production',
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