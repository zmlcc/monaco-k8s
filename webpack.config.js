const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
// module.exports = {
//   context: path.resolve(__dirname, 'src'),
//   entry: {
//     app: './app.js',
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: '[name].bundle.js',
//   },
// };

module.exports = {
    mode: "none",

    // entry: {
        // "main": "./src/app/main.ts",//已多次提及的唯一入口文件
        // "editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
		// "json.worker": 'monaco-editor/esm/vs/language/json/json.worker',
		// "css.worker": 'monaco-editor/esm/vs/language/css/css.worker',
		// "html.worker": 'monaco-editor/esm/vs/language/html/html.worker',
		// "ts.worker": 'monaco-editor/esm/vs/language/typescript/ts.worker',
    // },
    entry: "./src/app/main.ts",
    output: {
        // globalObject: 'self',
        path: path.resolve(__dirname, "dist"),//打包后的文件存放的地方
        filename: "[name].bundle.js"//打包后输出文件的文件名
    },

    devtool: 'source-map',

    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),// 配置开发服务运行时的文件根目录
        host: 'localhost',// 开发服务器监听的主机地址
        compress: true,   // 开发服务器是否启动gzip等压缩
        port: 8080        // 开发服务器监听的端口
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
              },
             
        ]
    },

    optimization: {
        minimizer: [new TerserPlugin()]
      },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html", //new 一个这个插件的实例，并传入相关的参数
            filename: 'index.html'
        }),
        new CopyWebpackPlugin([
            { from: './src/schema.json', to: './' },
          ]),
        new CleanWebpackPlugin(['dist']),
        // new UglifyJSPlugin()
        new MonacoWebpackPlugin({
            languages: ["yaml"],
            features: ["hover"]
        })
    ],

    node: {
        fs: "empty",
        net: "empty",
        tls: 'empty'
     }
}