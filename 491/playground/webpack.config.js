const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "./dist"),
    },
    devServer: {
        port: 9000,
        watchFiles: path.join(__dirname, "./src"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Playground",
            template: path.resolve(__dirname, "./src/index.html"),
            filename: "index.html",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
};

module.exports = (_, { mode }) => {
    config.mode = mode || "development";

    if (!mode) {
        config.devtool = "source-map";
    }

    return config;
};
