const path = require("path");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const isProduction = process.argv[process.argv.indexOf("--mode") + 1] === "production";
const env = isProduction ? "prod" : "dev";

console.log("TARGET ENV: " + env);

function formatDate(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + ampm;
    return (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + " " + strTime;
}

module.exports = {
    formatDate,
    config: {
        entry: {
            main: "./ts/index.ts"
        },

        // this puts our bundle.js file into current folder "public"
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].[contenthash].js",
            clean: true
        },

        resolve: {
            extensions: [".tsx", ".ts", ".js", ".json", ".scss"]
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [{
                        loader: "ts-loader",
                        options: {
                            configFile: "tsconfig." + env + ".json"
                        }
                    }],
                    exclude: /node_modules/
                },

                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                // #sourceMap
                {
                    test: /\.js$/,
                    enforce: "pre",
                    use: [{
                        loader: "source-map-loader"
                    }]
                },

                {
                    // handles both scss or css files.
                    test: /\.(sc|c)ss$/i,
                    use: [{
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }]
                },
                {
                    test: /\.htm$/,
                    use: [{
                        loader: "html-loader"
                    }]
                },

                // Webpack 5 way of doing what used to be 'file-loader'
                {
                    test: /\.(jpg)$/,
                    type: "asset/resource"
                }
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                filename: "../../templates/index.html",
                template: "indexTemplate.html",
                publicPath: "/dist",

                scriptLoading: "module",
                inject: "body"
            }),

            new HtmlWebpackPlugin({
                filename: "../../templates/error.html",
                template: "errorTemplate.html",
                publicPath: "/dist"
                // scriptLoading: "blocking",
                // inject: "head"
            }),

            new ESLintPlugin({
                extensions: [".txs", ".ts", ".js"],
                exclude: "node_modules"
            }),

            new CircularDependencyPlugin({
                // `onDetected` is called for each module that is cyclical
                onDetected({ module: webpackModuleRecord, paths, compilation }) {
                    // `paths` will be an Array of the relative module paths that make up the cycle
                    // `module` will be the module record generated by webpack that caused the cycle
                    const fullPath = paths.join(" -> ");
                    if (fullPath.indexOf("node_modules") === -1) {
                        compilation.errors.push(new Error("CIRC. REF: " + fullPath));
                    }
                }
            })
        ]
    }
};