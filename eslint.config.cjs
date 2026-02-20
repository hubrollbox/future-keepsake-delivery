const tsParser = require('@typescript-eslint/parser');
const tsEslintPlugin = require('@typescript-eslint/eslint-plugin');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
  {
    ignores: ['dist', 'cypress'],
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
    },
    rules: {
      // Base
      'no-unused-vars': 'warn',
      'no-undef': 'warn',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript
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
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        context: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
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