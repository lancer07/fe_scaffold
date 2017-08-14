var path = require("path");
var fs = require("fs");
var webpack = require("webpack")
var merge = require("webpack-merge");
var entries = {};

const ROOT_PATH = path.join(__dirname, "./res/vue");
const BUILD_PATH = path.join(__dirname, './res/build');
const ENTRYS_PATH = path.join(ROOT_PATH, 'entrys');
const ARGVS = process.argv;
const VENDORS = [
    "vue",
    "vue-popup",
    "lodash",
    "blueimp-md5"
];

const BABEL_CONFIG = {
  babelrc: false,
  cacheDirectory: true,
  presets: ["stage-0", "es2015"],
  plugins: ["syntax-jsx", "transform-class-properties", "transform-object-assign", "transform-vue-jsx"],
}

/**
 * 获取入口文件列表
 * 
 * @param {any} rootPath 
 * @param {any} modulePath 
 */
function getEntryPath(entryPath, modulePath) {
    try {
        var dirList = fs.readdirSync(entryPath);
        var dirFull, dirParsed;

        dirList.forEach(dir => {
            dirFull = path.join(entryPath, dir);
            dirParsed = path.parse(dirFull);
            if(/\.js$/.test(dirParsed.ext)) {
                entries[path.join(modulePath, dirParsed.name)] = "./"+path.relative(__dirname, dirFull);
            } else {
                getEntryPath(path.join(entryPath, dir), path.join(modulePath, dir))
            }
        });
    } catch(e) {
        console.log("Vue打包脚本，获取打包文件入口列表异常：", e);
    }
}

function isExistArgv(argv) {
    var result = false;
    if(Array.isArray(ARGVS)) {
        result = ARGVS.some((item) => {
            return item === `--${argv}`
        })
    }
    return result;
}

function webpackConfig() {
    getEntryPath(ENTRYS_PATH, "")
    
    var config = {
        output: {
            filename: "[name].js",
            path: BUILD_PATH
        },
        resolve: {
            alias: {
                "vue$": "vue/dist/vue.min.js"
            },
            root: path.join(__dirname, "./res/vue"),
            extensions: ["", ".js", ".vue", ".json"]
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    "NODE_ENV": "production"
                }
            })
        ]
    };

    if(isExistArgv("dll")) {
        config = merge(config, {
            entry: {
                //"vendor": VENDORS
            },
            output: {
                library: "[name]"
            },
            plugins: [
                new webpack.DllPlugin({
                    path: path.join(BUILD_PATH, "/[name]-manifest.json"),
                    name: "[name]"
                }),
                new webpack.optimize.OccurenceOrderPlugin()
            ]
        })
    } else {
        config = merge(config, {
            entry: entries,
            module: {
                loaders: [
                    {
                        test: /\.vue$/,
                        loader: "vue",
                        exclude: /node_modules/
                    }, 
                    {
                        test: /\.js$/,
                        loader: "babel",
                        exclude: /node_modules/,
                        query: BABEL_CONFIG
                    }, 
                    {
                        test: /\.less$/,
                        loader: "style!css!less",
                        exclude: /node_modules/
                    },
                    {
                        extensions: "json",
                        test: /\.json$/,
                        loader: "json"
                    }
                ]
            },
            devtool: "source-map",
            plugins: [
                // new webpack.DllReferencePlugin({      
                //     context: ".",                  
                //     manifest: require(`${BUILD_PATH}/vendor-manifest.json`) 
                // }),
                new webpack.NoErrorsPlugin()
            ]
        })
    }

    if(isExistArgv("dev")) {
        process.env.BABEL_ENV = "vue_dev"
        config = merge(config, {
            resolve: {
                alias: {
                    "vue$": "vue/dist/vue.js"
                }
            },
            plugins: [
                new webpack.DefinePlugin({
                    "process.env": {
                        "NODE_ENV": "development"
                    }
                })
            ]
        })
    } else {
        process.env.BABEL_ENV = "vue_prod"
        config = merge(config, {
            plugins: [
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    },
                    output:{
                        comments: false
                    }
                }),
                new webpack.optimize.OccurenceOrderPlugin()
            ]
        })
        
    }

    return config;
}
module.exports = webpackConfig()