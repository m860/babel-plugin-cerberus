const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        test1: "./test/test1.js"
    },
    devtool: false,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow'],
                        plugins: [
                            [
                                "@babel/plugin-proposal-decorators",
                                {
                                    "legacy": true
                                }
                            ],
                            "@babel/plugin-proposal-object-rest-spread",
                            "@babel/plugin-proposal-class-properties",
                            [
                                "./index.js",
                                {
                                    modules: [
                                        "dateformat",
                                        "object-path"
                                    ]
                                }
                            ]
                        ]
                    }
                }],
            }
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        // libraryTarget: "commonjs"
        // libraryTarget: "assign",
        // library:"return"

    },
    devServer: {
        contentBase: path.join(__dirname, 'test'),
        compress: true,
        port: 3000
    }
};