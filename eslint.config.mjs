import eslint from '@eslint/js';
import eslintPluginFormatjs from 'eslint-plugin-formatjs';
import eslintPluginPatternflyReact from 'eslint-plugin-patternfly-react';
import eslintPluginPrettier from 'eslint-plugin-prettier';
// import jestPlugin from 'eslint-plugin-jest';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginTestingLibrary from 'eslint-plugin-testing-library';
import eslintPluginSortKeysFix from 'eslint-plugin-sort-keys-fix';
import eslintConfigRedhatCloudServices from '@redhat-cloud-services/eslint-config-redhat-cloud-services';
// import testingLibraryReact from '@testing-library/react';
import tseslint from 'typescript-eslint';

// export default tseslint.config(
export default [
  // {
  //   ignores: ['src/testUtils.ts'],
  // },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // files: ['src/**/*.ts)', 'src/**/*.tsx'],
    plugins: {
      // 'rulesdir' : eslintConfigRedhatCloudServices, // not working
      // 'patternfly': eslintPluginPatternflyReact, // not working
      'prettier': eslintPluginPrettier,
      'formatjs': eslintPluginFormatjs, // not working -- see https://github.com/formatjs/formatjs/issues/4388
      'react': eslintPluginReact,
      'simple-import-sort': eslintPluginSimpleImportSort,
      'testing-library': eslintPluginTestingLibrary, // not working -- see https://github.com/testing-library/eslint-plugin-testing-library/issues/899
    },
    languageOptions: {
      globals: {
      //   'browser': true,
      //   'es6': true,
      //   'node': true,
      },
      parser: tseslint.parser,
      'parserOptions': {
        'sourceType': 'module',
      },
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/ban-types': 'error',
      '@typescript-eslint/camelcase': 'off',
      // '@typescript-eslint/class-name-casing': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      // '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/indent': 'off',
      // '@typescript-eslint/interface-name-prefix': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      'arrow-parens': [2, 'as-needed', { 'requireForBlockBody': false }],
      'constructor-super': 'error',
      'curly': 'error',
      'dot-notation': 'error',
      'eqeqeq': [
        'error',
        'smart'
      ],
      // 'formatjs/enforce-default-message': 'error',
      // 'formatjs/enforce-description': 'error',
      // 'formatjs/enforce-id': 'error',
      'guard-for-in': 'error',
      'max-classes-per-file': [
        'error',
        1
      ],
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
      'no-restricted-imports': ['error', {
        'patterns': ['../*/**']
      }],
      'no-shadow': 'error',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'off',
      'no-undef': 'off',
      'no-undef-init': 'error',
      'no-unsafe-finally': 'error',
      'no-unused-expressions': ['error', {
        'allowTernary': true,
        'allowShortCircuit': true
      }],
      'no-unused-labels': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'one-var': [
        'error',
        'never'
      ],
      'patternfly-react/no-anonymous-functions': 0,
      'prefer-const': 'error',
      'prettier/prettier': 'error',
      'radix': [
        'error',
        'as-needed'
      ],
      'react-hooks/exhaustive-deps': 0, // 'warn',
      'react/display-name': 0,
      'react/no-unescaped-entities': ['error', { 'forbid': ['>', '}']}],
      'react/no-unknown-property': ['error', { 'ignore': ['key']}],
      'react/prop-types': 0,
      'simple-import-sort/imports': 'error',
      'spaced-comment': 'error',
      'rulesdir/disallow-pf-migrated-components': 'off',
      'rulesdir/forbid-pf-relative-imports': 'off',
      // 'testing-library/await-async-queries': 'error',
      // 'testing-library/no-await-sync-queries': 'error',
      // 'testing-library/no-debugging-utils': 'warn',
      // 'testing-library/no-dom-import': 'off',
      'use-isnan': 'error'
    }
  },
  {
    files: [ 'src/locales/messages.ts' ],
    plugins: {
      'sort-keys-fix': eslintPluginSortKeysFix,
    },
    rules: {
      'sort-keys-fix/sort-keys-fix': 'error'
    }
  }, {
    // Enable eslint-plugin-testing-library rules or preset only for matching files!
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    // 'extends': ['plugin:testing-library/react']
    plugins: {
      // 'testing-library/react': testingLibraryReact,
      'testing-library/react': eslintPluginTestingLibrary,
    },
  }
];
