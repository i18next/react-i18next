var path = require('path');
var webpack = require('webpack');

// remove prod for now
// var isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: [
    './app/main.js'
  ],
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'app.js'
  },
  plugins: [ // removed uglify for now
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: path.join(__dirname, 'app')
    }]
  }
};
