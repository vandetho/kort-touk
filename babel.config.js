const path = require('path');

module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            '@babel/transform-react-jsx-source',
            'babel-plugin-transform-typescript-metadata',
            'react-native-reanimated/plugin',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            [
                'module-resolver',
                {
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.android.js', '.android.tsx', '.ios.js', '.ios.tsx'],
                    root: ['./'],
                    alias: {
                        '@assets': path.resolve(__dirname, './assets'),
                        '@components': path.resolve(__dirname, './components'),
                        '@config': path.resolve(__dirname, './config'),
                        '@constants': path.resolve(__dirname, './constants'),
                        '@contexts': path.resolve(__dirname, './contexts'),
                        '@database': path.resolve(__dirname, './database'),
                        '@fetchers': path.resolve(__dirname, './fetchers'),
                        '@hooks': path.resolve(__dirname, './hooks'),
                        '@interfaces': path.resolve(__dirname, './interfaces'),
                        '@locales': path.resolve(__dirname, './locales'),
                        '@migrations': path.resolve(__dirname, './migrations'),
                        '@models': path.resolve(__dirname, './models'),
                        '@navigations': path.resolve(__dirname, './navigations'),
                        '@repositories': path.resolve(__dirname, './repositories'),
                        '@screens': path.resolve(__dirname, './screens'),
                        '@seeds': path.resolve(__dirname, './seeds'),
                        '@theme': path.resolve(__dirname, './theme'),
                        '@utils': path.resolve(__dirname, './utils'),
                    },
                },
            ],
        ],
    };
};
