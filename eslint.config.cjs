const tsParser = require('@typescript-eslint/parser');

module.exports = {

  languageOptions: {
    globals: {
      browser: true,
      es2020: true,
    },
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    'react-hooks': require('eslint-plugin-react-hooks'),
    'react-refresh': require('eslint-plugin-react-refresh'),
  },
  rules: {
    // Rules from eslint:recommended
    'no-unused-vars': 'warn',
    'no-undef': 'warn',

    // Rules from plugin:@typescript-eslint/recommended
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // Rules from plugin:react-hooks/recommended
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
  },
  ignores: ['dist'],
  overrides: [
    {
      files: ['src/components/OnboardingFlow.tsx'],
      rules: {
        'react-hooks/exhaustive-deps': 'off',
      }
    }
  ]
};
