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
                        presets:['module:metro-react-native-babel-preset'],
                        plugins:[
                            [
                                "./index.js",
                                {
                                    modules: [
                                        "dateformat",
                                        "object-path"
                                    ],
                                    cwd:path.resolve(__dirname)
                                }
                            ]
                        ]
                    }
                }],
            }, {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: {
                    loader: "file-loader",
                },
                exclude: /node_modules/,
            }
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    }
};
