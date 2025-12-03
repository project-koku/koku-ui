import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import formatjs from 'eslint-plugin-formatjs';
import prettier from 'eslint-plugin-prettier';
// import patternflyReact from "eslint-plugin-patternfly-react";
import react from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/** @typedef {import("eslint").Linter.Config} FlatConfig */
/** @type {FlatConfig[]} */
const eslintConfig = [
  {
    ignores: [
      '**/node_modules',
      '**/public',
      '**/dist',
      '**/.DS_Store',
      '**/coverage',
      '**/npm-debug.log',
      '**/yarn-debug.log',
      '**/yarn-error.log',
      '**/.idea',
      '**/.project',
      '**/.classpath',
      '**/.c9',
      '**/*.launch',
      '**/.settings',
      '**/*.sublime-workspace',
      '**/.history',
      '**/.vscode',
      '**/*.swp',
      '**/*.test.ts',
      '**/*.test.tsx',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      // '@redhat-cloud-services/eslint-config-redhat-cloud-services',
      'eslint:recommended', // Extended by eslint-config-redhat-cloud-services
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended', // Extended by eslint-config-redhat-cloud-services
      'plugin:react-hooks/recommended'
    )
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      formatjs,
      // 'patternfly-react': patternflyReact,
      prettier, // Plugin defined by eslint-config-redhat-cloud-services
      react: fixupPluginRules(react),
      'simple-import-sort': simpleImportSort,
      'sort-keys-fix': sortKeysFix,
      'testing-library': testingLibrary,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        afterEach: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        global: 'writable',
        insights: 'readonly',
        it: 'readonly',
        jest: 'readonly',
        mount: 'readonly',
        render: 'readonly',
        require: 'readonly',
        test: 'readonly',
        shallow: 'readonly',
      },

      ecmaVersion: 7,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/unified-signatures': 'error',

      'arrow-parens': [
        2,
        'as-needed',
        {
          requireForBlockBody: false,
        },
      ],

      'constructor-super': 'error',
      curly: 'error',
      'dot-notation': 'error',
      eqeqeq: ['error', 'smart'],
      // 'formatjs/enforce-default-message': 'error', // Not working -- see https://github.com/formatjs/formatjs/issues/4388
      // 'formatjs/enforce-description': 'error',
      // 'formatjs/enforce-id': 'error',
      'guard-for-in': 'error',
      'max-classes-per-file': ['error', 1],
      'max-len': 'off',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-cond-assign': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-empty': 'error',
      'no-eval': 'error',
      'no-new-wrappers': 'error',
      'no-prototype-builtins': 'off',
      'no-shadow': 'error',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'off',
      'no-undef': 'off',
      'no-undef-init': 'error',
      'no-unsafe-finally': 'error',

      'no-unused-expressions': [
        'error',
        {
          allowTernary: true,
          allowShortCircuit: true,
        },
      ],

      'no-unused-labels': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'patternfly-react/no-anonymous-functions': 0,
      'prefer-const': 'error',
      'prettier/prettier': 'error',
      radix: ['error', 'as-needed'],
      'react-hooks/exhaustive-deps': 0,
      'react-hooks/preserve-manual-memoization': 0, // Temp workaround for 7.0.0
      'react-hooks/set-state-in-effect': 0, // Temp workaround for 7.0.0
      'react/display-name': 0,
      'react/no-is-mounted': 0,
      'react/no-unescaped-entities': [
        'error',
        {
          forbid: ['>', '}'],
        },
      ],

      'react/no-unknown-property': [
        'error',
        {
          ignore: ['key'],
        },
      ],

      'react/prop-types': 0,
      'simple-import-sort/imports': 'error',
      'spaced-comment': 'error',
      'rulesdir/disallow-pf-migrated-components': 'off',
      'rulesdir/forbid-pf-relative-imports': 'off',
      'testing-library/await-async-queries': 'error',
      'testing-library/no-await-sync-queries': 'error',
      // 'testing-library/no-debugging-utils': 'warn', // Not working -- see https://eslint.org/docs/latest/use/troubleshooting/v9-rule-api-changes
      'testing-library/no-dom-import': 'off',
      'use-isnan': 'error',
    },
  },
  {
    files: ['libs/**/*.{js,jsx,ts,tsx}'],

    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@redhat-cloud-services/*'],
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/locales/messages.ts'],

    rules: {
      'sort-keys-fix/sort-keys-fix': 'error',
    },
  },
  ...compat.extends('plugin:testing-library/react').map(config => ({
    ...config,
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  })),
];

export default eslintConfig;
