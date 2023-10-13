const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = [...config.resolver.assetExts, 'db', 'sqlite'];
config.transformer.minifierConfig = {
    compress: {
        drop_console: true,
        reduce_funcs: false,
    },
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
        keep_classnames: true,
        keep_fnames: true,
    },
    output: {
        ascii_only: true,
        quote_style: 3,
        wrap_iife: true,
    },
    sourceMap: {
        includeSources: false,
    },
    toplevel: false,
};

module.exports = config;
