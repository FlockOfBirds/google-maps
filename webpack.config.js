const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/com/mendix/widget/GoogleMaps/GoogleMaps.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/com/mendix/widget/GoogleMaps/GoogleMaps.js",
        libraryTarget:  "umd"
    },
    resolve: {
        extensions: [ "", ".ts", ".js", ".json" ],
        alias: {
            "react-google-maps": path.resolve(__dirname, "./node_modules/react-google-maps"),
            "tests": path.resolve(__dirname, "./tests")
        }
    },
    errorDetails: true,
    module: {
        loaders: [
            { test: /\.ts$/, loader: "ts-loader" },
            { test: /\.json$/, loader: "json" }
        ]
    },
    devtool: "source-map",
    externals: [ "mxui/widget/_WidgetBase", "mendix/lang", "dojo/_base/declare" ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" },
            { from: "src/**/*.css" },
            { from: "src/**/*.png" }
        ], {
            copyUnmodified: true
        })
    ],
    watch: true
};
