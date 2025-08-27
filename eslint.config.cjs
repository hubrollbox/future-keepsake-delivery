module.exports = {

  languageOptions: {
    globals: {
      browser: true,
      es2020: true,
    },
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'react-refresh'
  ],
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
  ignorePatterns: ['dist'],
  overrides: [
    {
      files: ['src/components/OnboardingFlow.tsx'],
      rules: {
        'react-hooks/exhaustive-deps': 'off',
      }
    }
  ]
};
