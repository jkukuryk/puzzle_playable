const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

function getTime() {
    const now = new Date();
    return (
        now.getFullYear() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        '_' +
        now.getHours().toString().padStart(2, '0') +
        '' +
        now.getMinutes().toString().padStart(2, '0')
    );
}
module.exports = merge(common, {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './playable-' + getTime() + '.html',
            title: 'playable',
            inlineSource: '.(js|css|png|jpg|svg|mp3|gif)$',
        }),
        new HtmlInlineScriptPlugin(),
    ],
    mode: 'production',
    output: {
        path: path.resolve(__dirname, './dist'),
    },
});
