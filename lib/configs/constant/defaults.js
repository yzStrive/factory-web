"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = exports.WEBPACK_DEV_SERVER_CONFIG = exports.WEBPACK_STATS = exports.HOST = exports.PORT = void 0;
const paths_1 = require("./paths");
// http server config
exports.PORT = 9000;
exports.HOST = '0.0.0.0';
exports.WEBPACK_STATS = {
    assets: true,
    // `webpack --colors` equivalent
    colors: true,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    // Add errors
    errors: true,
    // Add details to errors (like resolving log)
    errorDetails: true,
    hash: false,
    modules: false,
    timings: true,
    // Add webpack version information
    version: true
};
// webpack-dev-server config
exports.WEBPACK_DEV_SERVER_CONFIG = {
    contentBase: paths_1.paths.dist,
    clientLogLevel: 'silent',
    historyApiFallback: true,
    compress: true,
    hot: true,
    open: false,
    overlay: true,
    stats: 'errors-only',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*'
    },
    disableHostCheck: true,
    host: exports.HOST,
    port: exports.PORT,
    noInfo: true
};
const isDev = () => {
    const buildMode = process.env.NODE_ENV || 'development';
    return buildMode === 'development';
};
exports.isDev = isDev;