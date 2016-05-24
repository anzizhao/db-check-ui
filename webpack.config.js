var path = require('path');
var webpack = require('webpack');
var merge = require('merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var webpackConfig = {
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]bundle.js',
        publicPath: '/dist/'
    },
    externals: {
        //"jquery": "jQuery"
    },
    resolve: {
        extensions: ['', '.js', '.jsx' ]

    },
};

if (process.env.NODE_ENV === 'production') {
    webpackConfig = merge(webpackConfig,{
        devtool: "source-map",
        entry : {
            app: './src/client',
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/, 
                    loaders: ['react-hot', 'babel'], 
                    include: path.join(__dirname, 'src')
                },
                { 
                    test: /\.(png|jpg|gif|jpeg)$/, 
                    loader: 'url?limit=8192'
                },
                {
                    test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
                    loader: 'url-loader?limit=8192'
                },
                {
                    test: /\.css/,
                    exclude: path.resolve(__dirname, 'styles/'),
                    loader: 'style!css?modules&localIdentName=[name]__[local]?sourceMap=true'
                }, 

                {
                    test: /\.scss$/,
                    include: path.resolve(__dirname, 'styles/'),
                    loader: 'style!css!sass?sourceMap=true'
                }, 
                {
                    test: /\.css$/,
                    include: path.resolve(__dirname, 'styles/'),
                    loader: 'style!css?sourceMap=true'
                },
            ]},

            plugins : [
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify('production')
                    }
                }),
                new CommonsChunkPlugin("commons.chunk.js"),
                new webpack.HotModuleReplacementPlugin(),
                new webpack.optimize.OccurenceOrderPlugin(),
                new ExtractTextPlugin("app.css"),
                new webpack.optimize.UglifyJsPlugin({minimize: true})
            ]  
    });

}else{
    //webpackConfig.output.publicPath = 'http://localhost:3000/'
    webpackConfig = merge(webpackConfig,{
        devtool: 'eval',
        module: {
            loaders: [
                {
                    test: /\.jsx?$/, 
                    loaders: ['react-hot', 'babel'], 
                    include: path.join(__dirname, 'src')
                },
                { 
                    test: /\.(png|jpg|gif|jpeg)$/, 
                    loader: 'url?limit=8192'
                },
                {
                    test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
                    loader: 'url?limit=8192'
                },
                //{
                    //test: /\.css/,
                    //exclude: path.resolve(__dirname, 'styles/'),
                    //loader: 'style!css?modules&localIdentName=[name]__[local]?sourceMap=true'
                //}, 

                {
                    test: /\.scss$/,
                    include: path.resolve(__dirname, 'styles/'),
                    loader: 'style!css!sass?sourceMap=true'
                }, 
                {
                    test: /\.css$/,
                    //include: path.resolve(__dirname, 'styles/'),
                    loader: 'style!css'
                },
            ]
        },
        entry :{
            app:  [
                'webpack-dev-server/client?http://localhost:3021',
                'webpack/hot/only-dev-server',
                './src/client/index.js',
            ],
        } ,
        plugins : [
            new CommonsChunkPlugin("commons.chunk.js"),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            new ExtractTextPlugin("app.css"),
            new webpack.NoErrorsPlugin()
        ]  
    });

}

module.exports = webpackConfig;
