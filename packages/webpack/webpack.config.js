const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DingTalkMsgPlugin = require('@zzf-webpack/plugin')

module.exports = {
    entry: "./lib/webpack.js",
    mode: "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.md$/,
                use: ["html-loader", "@zzf-webpack/loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({title: "Hot Module Replacement"}),
        new DingTalkMsgPlugin({
            webhook: 'https://oapi.dingtalk.com/robot/send?access_token=xxxx',
            secret: 'xxxxx'
        })
    ],
    devServer: {
        inline: true,
        // hot:false
        hotOnly: true,
        open: true,
    },
};
