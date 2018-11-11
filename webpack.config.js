const path = require('path');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'demoit.js'
  },
  mode: 'development',
  // mode: 'production',
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