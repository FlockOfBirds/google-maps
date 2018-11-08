"use strict";
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const widgetNames = Object.keys(webpackConfig[0].entry);

const webpackConfigRelease = webpackConfig.map(config => merge(config, {
    devtool: false,
    mode: "production"
}));

webpackConfigRelease[0].plugins.push(new ExtractTextPlugin({
    filename: `./widgets/com/mendix/widget/custom/[name]/ui/[name].css`
}));

webpackConfigRelease[0].module.rules[1] = {
    test: /\.css$/, loader: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [ "css-loader", "sass-loader" ]
    })
};

module.exports = function(grunt) {
    const pkg = grunt.file.readJSON("package.json");
    grunt.initConfig({
        watch: {
            updateWidgetFiles: {
                files: [ "./src/**/*" ],
                tasks: [ "webpack:develop", "file_append", "compress:dist", "copy:distDeployment", "copy:mpk" ],
                options: {
                    debounceDelay: 250,
                    livereload: true
                }
            }
        },

        compress: {
            dist: {
                options: {
                    archive: "./dist/" + pkg.version + "/" + pkg.widgetName + ".mpk",
                    mode: "zip"
                },
                files: [ {
                    expand: true,
                    date: new Date(),
                    store: false,
                    cwd: "./dist/tmp/widgets",
                    src: [ "**/*" ]
                } ]
            }
        },

        copy: {
            distDeployment: {
                files: [ {
                    dest: "./dist/MxTestProject/deployment/web/widgets",
                    cwd: "./dist/tmp/widgets/",
                    src: [ "**/*" ],
                    expand: true
                } ]
            },
            mpk: {
                files: [ {
                    dest: "./dist/MxTestProject/widgets",
                    cwd: "./dist/" + pkg.version + "/",
                    src: [ pkg.widgetName + ".mpk" ],
                    expand: true
                } ]
            }
        },

        file_append: {
            addSourceURL: {
                files: widgetNames.map(widgetName => {
                    return {
                        append: `\n\n//# sourceURL=${widgetName}.webmodeler.js\n`,
                        input: `dist/tmp/widgets/${widgetName}.webmodeler.js`
                    };
                })
            }
        },

        webpack: {
            develop: webpackConfig,
            release: webpackConfigRelease
        },

        clean: {
            build: [
                "./dist/" + pkg.version + "/" + pkg.widgetName + "/*",
                "./dist/tmp/**/*",
                "./dist/MxTestProject/deployment/web/widgets/" + pkg.widgetName + "/*",
                "./dist/MxTestProject/widgets/" + pkg.widgetName + ".mpk",
                "./dist/wdio/**/*"
            ]
        },

        checkDependencies: {
            this: {}
        }
    });

    grunt.loadNpmTasks("grunt-check-dependencies");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-file-append");
    grunt.loadNpmTasks("grunt-webpack");

    grunt.registerTask("default", [ "clean build", "watch" ]);
    grunt.registerTask(
        "clean build",
        "Compiles all the assets and copies the files to the dist directory.",
        [ "checkDependencies", "clean:build", "webpack:develop", "file_append", "compress:dist", "copy" ]
    );
    grunt.registerTask(
        "release",
        "Compiles all the assets and copies the files to the dist directory. Minified without source mapping",
        [ "checkDependencies", "clean:build", "webpack:release", "file_append", "compress:dist", "copy:mpk" ]
    );
    grunt.registerTask("build", [ "clean build" ]);
};
