const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const srcDir = path.join(__dirname, './src');
const distDir = path.join(__dirname, './dist');


module.exports = {
    entry: getEntryFiles(),
    output: {
        filename: '[name].[chunkhash:8].js',
        path: path.resolve(__dirname, 'dist/js')
    },
    module: {
        rules: [{
            test: /\.css$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: {
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                }
            })
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        minimize: true
                    }
                }]
            })
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                }, {
                    loader: 'less-loader',
                    options: {
                        minimize: true
                    }
                }]
            })
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '../img/[name].[ext]'
                }
            }]
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            exclude: /node_modules/,
            use: [
                'file-loader'
            ]
        }]
    },
    externals: {
        $: 'Zepto'
    },
    plugins: getPlugins()
    //,
    //提取公共模块使用
    // optimization: {
    //     runtimeChunk: {
    //         name: "common"
    //     },
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: "vendor",
    //                 chunks: "all"
    //             }
    //         }
    //     }
    // }
};


/**
 * 获取入口文件
 * @return {object} [返回以页面为单位的每个页面入口文件js]
 */
function getEntryFiles() {
    var files = {};
    var js_src = path.join(__dirname, './src/js');
    var items = fs.readdirSync(js_src);

    if (items) {
        items.forEach(function (item) {
            if (item.match(/\.js$/)) {
                files[item.replace('.js', '')] = path.join(js_src, item);
            }
        });
    }
    return files;
}

/**
 * 把page页面和script标签合并，输出到dist/page目录下
 * @return [Array]
 */
function emitPages() {
    let pages = [],
        js_src = path.join(__dirname, './src/page'),
        items = fs.readdirSync(js_src);

    if (items) {
        items.forEach(function (item) {
            if (item.match(/\.html$/)) {
                pages.push(new HtmlWebpackPlugin({
                    chunks: [item.replace('.html', ''), 'zepto'],
                    filename: '../page/' + item,
                    template: 'src/page/' + item
                }));
            }
        });
    }
    return pages;
}

/**
 * 整合所有plugin
 * @return [Array]
 */
function getPlugins() {
    let pluginsArr = [
        new ExtractTextPlugin('../css/[name].[contenthash:8].css'),
        new CopyWebpackPlugin([{
            from: srcDir + '/img/',
            to: distDir + '/img/'
        }, {
            from: srcDir + '/js/lib/',
            to: distDir + '/js/lib'
        }, {
            from: srcDir + '/style/reset.css',
            to: distDir + '/css/'
        }], {})
    ];
    let pageArr = emitPages();
    return pluginsArr.concat(pageArr);
}