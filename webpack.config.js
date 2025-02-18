const path = require('path');

module.exports = {
    entry: './src/index.js', // your main JS file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    mode: 'development', // switch to 'production' for a production build
    devServer: {
        static: path.join(__dirname, 'public'),
        port: 8080,
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // if you want to use ES6+ features in older browsers
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
