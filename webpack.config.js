const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const sketches = ['src/examples/camera/cinematic', 'src/examples/lights/hemisphere'];
const entry = {};
const htmlPlugins = [];

for (let i = 0; i < sketches.length; i++) {
  const name = sketches[i];
  const rel = path.join('./', name);
  if (fs.lstatSync(rel).isDirectory()) {
    const files = fs.readdirSync(rel).map(path.parse);
    const js = files.find(file => {
      return file.ext === '.js' && (file.name === 'index' || file.name === path.parse(name).name);
    });
    const html = files.find(file => file.ext === '.html');
    const chunkName = path.join('sketch', name);
    entry[chunkName] = './' + path.join(name, js.name);
    const filename = name + '.html';
    const template = './' + path.join(rel, html.base);
    htmlPlugins.push(new HtmlWebpackPlugin({
      filename,
      template,
      chunks: [chunkName]
    }));
  } else {
    throw new Error(`Sketch ${sketches[i]} not found!`);
  }
}

module.exports = {
  devtool: "eval-source-map",
  mode: 'development',
  entry,
  output: {
    path: "/",
    filename: "[name].js"
  },
  plugins: htmlPlugins,
  resolve: {
    alias: {
      // paper: path.resolve(__dirname, 'src/paper-modified'),
      models: path.resolve(__dirname, 'src/models'),
    }
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          'file-loader'
        ]
      },
    ]
  }
};
