const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.resolve('./src/script.ts'),
    devtool: 'inline-source-map',
    output: {
        filename: 'script.js',
        path: path.join(__dirname, 'out')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'ARSensorVisualization',
          template: './index.html'
        })
      ],
    devServer: {
        port: 4711,
        open: true,
    }
};