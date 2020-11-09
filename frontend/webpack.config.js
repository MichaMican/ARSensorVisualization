const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ARjs_THREE_Path = require.resolve('ar.js/three.js/build/ar')

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
			{
				// Load THREEx from ar.js
				test: ARjs_THREE_Path,
				use: 'exports-loader?THREEx',
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		alias: {
			// Provide three.js portion of ar.js as 'ar'
			ar$: ARjs_THREE_Path
		}
	},
	plugins: [
		new webpack.ProvidePlugin({ // Provide THREE for ar.js
			THREE: 'three'
		}),
		new HtmlWebpackPlugin({
		  title: 'ARSensorVisualization',
		  template: './index.html'
		})
	  ],
	devServer: {
		port: 4711,
		open: true,
	},
	node: {
		// Fix the node 'fs' module being looked for, and not found
		fs: 'empty'
	}
};