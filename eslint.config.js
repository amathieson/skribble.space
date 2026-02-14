import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import vitest from '@vitest/eslint-plugin';

export default [
    // Global ignores
    { ignores: ['dist', 'dev-dist', 'vite.config.js', 'stylelint.config.js'] },

    //Not Tests
    {
        files: ['**/*.{js,jsx}'],
        ignores: ['**/*.test.js', '**/*.test.jsx', "**/__tests__/"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },

    // Tests
    {
        files: ['**/*.test.jsx'],
        ...vitest.configs.recommended,
        plugins: {
            vitest: vitest,
        },
        rules: {
            ...vitest.configs.recommended.rules,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {jsx: true},
            },
            globals: {
                ...globals.browser,
                ...vitest.environments.env.globals,
            },
        }
    },
];