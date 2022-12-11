const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        historyApiFallback: true,
    },
    plugins: [
        new ESLintPlugin({
            emitError: true,
            emitWarning: true,
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
});
