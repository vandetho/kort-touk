module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['prettier', 'plugin:prettier/recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
