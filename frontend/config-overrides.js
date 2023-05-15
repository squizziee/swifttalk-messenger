const webpack = require('webpack');
module.exports = function override(config, env) {
    config.resolve = {
        fallback: {
            buffer: require.resolve('buffer/'),
        },
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    );
    module.exports = {
        resolve: {
            fallback: {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve("stream-browserify"),
            },
        },
    };
    return config
}