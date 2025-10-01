const tsParser = require('@typescript-eslint/parser');
const tsEslintPlugin = require('@typescript-eslint/eslint-plugin');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactRefreshPlugin = require('eslint-plugin-react-refresh');

module.exports = [
  {
    ignores: ['dist'],
  },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
        window: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        URL: 'readonly',
        useCallback: 'readonly',
        jsdom: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      // Rules from eslint:recommended
      'no-unused-vars': 'warn',
      'no-undef': 'warn',

      // Rules from plugin:@typescript-eslint/recommended


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
  },
  {
    files: ['src/components/OnboardingFlow.tsx'],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
    }
  },
  {
    files: ['cypress/**/*.cy.js'],
    languageOptions: {
      globals: {
        'cypress/globals': true,
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        it: 'readonly'
      }
    },
    plugins: {
      cypress: require('eslint-plugin-cypress')
    },
    rules: {
      'no-undef': 'off',
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/assertion-before-screenshot': 'warn',
      'cypress/no-force': 'warn',
      'cypress/no-async-tests': 'error',
      'cypress/no-pause': 'error'
    }
  },
  {
    files: ['public/sw.js'],
    languageOptions: {
      globals: {
        self: true,
        caches: true,
        fetch: true
      }
    }
  },
  {
    files: ['ops/scripts/**/*.js', 'run-tests.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        fetch: 'readonly'
      },
      ecmaVersion: 2020,
      sourceType: 'commonjs'
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
];
