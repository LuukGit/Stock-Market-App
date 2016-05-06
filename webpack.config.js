var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'client/js');
var APP_DIR = path.resolve(__dirname, "app/components/");

var config = {
  entry: APP_DIR + '/App.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel',
        query: {
          presets: ["es2015", "react"]
        }
      }
    ],
  preLoaders: [
    {
      test: /\.jsx?$/,
      loaders: ['eslint'],
      include: APP_DIR
    }
  ]
}
};

module.exports = config;
