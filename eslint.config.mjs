//
// ROOT ESLint Configuration
//

/* eslint-env node */

import js from '@eslint/js';
import globals from 'globals';
import babel from '@babel/eslint-plugin';
import babelParser from '@babel/eslint-parser';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';

//
// Parser options and environments
//

const languageOptions = {
  ecmaVersion: 'latest',
};

// @see https://eslint.org/docs/latest/use/configure/language-options#specifying-parser-options
const parserOptions = {
  ecmaFeatures: {
    impliedStrict: true,
  },
  sourceType: 'module',
};

// @see https://www.npmjs.com/package/eslint-plugin-react
const reactParserOptions = {
  ...parserOptions,
  ...react.configs.flat['jsx-runtime'].languageOptions.parserOptions,
  ecmaFeatures: {
    ...parserOptions.ecmaFeatures,
    ...react.configs.flat['jsx-runtime'].languageOptions.parserOptions
      .ecmaFeatures,
    jsx: true,
  },
};

// for use with https://typescript-eslint.io/users/configs#projects-with-type-checking
// @see https://typescript-eslint.io/getting-started/typed-linting
const typedParserOptions = {
  ...parserOptions,
  ecmaFeatures: {
    ...parserOptions.ecmaFeatures,
    jsx: false,
  },
  project: true,
  tsconfigRootDir: import.meta.dirname,
};

//
// Plugins
//

const basePlugins = {
  '@babel': babel, // @see https://www.npmjs.com/package/@babel/eslint-plugin
};

//
// Globals
//

const baseGlobals = {
  // anything in addition to what `languageOptions.ecmaVersion` provides
  // @see https://eslint.org/docs/latest/use/configure/language-options#predefined-global-variables
};

const toolingGlobals = {
  ...baseGlobals,
  ...globals.node,
};

const browserGlobals = {
  ...baseGlobals,
  ...globals.browser,
};

const testGlobals = {
  ...browserGlobals,
  ...globals.jest,
};

// NOTE: these must also be defined in <repo>/src/globals.d.ts referenced in the
//  <repo>/tsconfig.json as well as the `globals` property in <repo>/jest.config.mjs
const srcGlobals = {
  WP_BUILD_ENV: 'readonly',
};

//
// Base rules
// @see http://eslint.org/docs/rules/RULE-NAME
//

const baseRules = {
  ...js.configs.recommended.rules,
  'no-regex-spaces': 'off',
  'no-await-in-loop': 'error',
  'no-async-promise-executor': 'error',
  'no-misleading-character-class': 'error',
  'no-unsafe-optional-chaining': 'error',

  //// Best practices

  curly: 'error',
  'default-case': 'error',
  eqeqeq: 'error',
  'guard-for-in': 'error',
  'no-alert': 'error',
  'no-caller': 'error',
  'no-console': 'error',
  'no-else-return': 'error',
  'no-eq-null': 'error',
  'no-eval': 'error',
  'no-lone-blocks': 'error',
  'no-loop-func': 'error',
  'no-multi-spaces': 'error',
  'no-new': 'off',
  'no-new-func': 'error',
  'no-new-wrappers': 'error',
  'no-throw-literal': 'error',
  'no-warning-comments': [
    'error',
    {
      terms: ['DEBUG', 'FIXME', 'HACK'],
      location: 'start',
    },
  ],

  //// Strict mode

  strict: ['error', 'function'],

  //// Variables

  'no-catch-shadow': 'error',
  'no-shadow': 'error',
  'no-unused-vars': [
    'error',
    {
      args: 'none',
      caughtErrors: 'none',
      vars: 'local',
    },
  ],
  'no-use-before-define': 'error',

  //// Stylistic issues

  // NONE: Prettier will take care of these by reformatting the code on commit,
  //  save a few exceptions.

  // Prettier will format using single quotes per .prettierrc.js settings, but
  //  will not require single quotes instead of backticks/template strings
  //  when interpolation isn't used, so this rule will catch those cases
  quotes: [
    'error',
    'single',
    {
      avoidEscape: true,
      allowTemplateLiterals: false,
    },
  ],

  //// ECMAScript 6 (non-stylistic issues only)

  'no-duplicate-imports': ['error', { includeExports: true }],
  'no-useless-constructor': 'error',
  'no-var': 'error',
  'prefer-const': 'error',
};

//
// React-specific rules
//

const reactRules = {
  ...react.configs.flat.recommended.rules,
  ...react.configs.flat['jsx-runtime'].rules,

  // not needed because we don't pre-compile React code, it just runs in the browser
  'react/react-in-jsx-scope': 'off',

  // PropTypes are deprecated and will be removed in React 19
  // @see https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-proptypes-and-defaultprops
  'react/forbid-foreign-prop-types': 'off',
  'react/prop-types': 'off',

  //// React-Hooks Plugin

  // default is 'warn', prefer errors (warnings just get ignored)
  'react-hooks/exhaustive-deps': 'error',
};

//
// TypeScript-specific rules
//

const typescriptRules = {
  ...typescript.configs['recommended-type-checked'].rules,

  // add overrides here as needed
};

//
// Test-specific rules
//

const testRules = {
  //// jest plugin

  'jest/no-disabled-tests': 'error',
  'jest/no-focused-tests': 'error',
  'jest/no-identical-title': 'error',
  'jest/valid-expect': 'error',
  'jest/valid-title': 'error',

  //// jest-dom plugin

  // this rule is buggy, and doesn't seem to work well with the Testing Library's queries
  'jest-dom/prefer-in-document': 'off',

  //// RTL plugin

  // this prevents expect(document.querySelector('foo')), which is useful because not
  //  all elements can be found using RTL queries (sticking to RTL queries probably
  //  means less fragile tests, but then there are things we wouldn't be able to
  //  test like whether something renders in Light mode or Dark mode as expected)
  'testing-library/no-node-access': 'off',

  // we use custom queries, which don't get added to `screen` (that's a miss in RTL, IMO),
  //  which means we _must_ destructure the result from `render()` in order to get to
  //  our custom queries
  'testing-library/prefer-screen-queries': 'off',

  // not much value in this one, and it's not sophisticated enough to detect all usage
  //  scenarios so we get false-positives
  'testing-library/await-async-utils': 'off',
};

//
// React settings
//

const reactSettings = {
  react: {
    // a version must be specified; here it's set to detect the current version
    version: 'detect',
  },
};

//
// Configuration generator functions
//

/**
 * Project scripts.
 * @param {boolean} isModule
 * @param {boolean} isTypescript Ignored if `isModule=false`
 * @returns {Object} ESLint config.
 */
const createToolingConfig = (isModule = true, isTypescript = false) => ({
  files: isModule ? (isTypescript ? ['**/*.m?ts'] : ['**/*.mjs']) : ['**/*.js'],
  ignores: ['src/**/*.*', 'tools/tests/**/*.*'],
  plugins: basePlugins,
  languageOptions: {
    ...languageOptions,
    parser: isTypescript ? typescriptParser : babelParser,
    parserOptions: {
      ...(isModule && isTypescript ? typedParserOptions : parserOptions),
      sourceType: isModule ? 'module' : 'script',
    },
    globals: {
      ...toolingGlobals,
    },
  },
  rules: {
    ...baseRules,
    ...(isModule && isTypescript ? typescriptRules : {}),
    'no-console': 'off',
  },
});

/**
 * JavaScript source files.
 * @param {boolean} isReact If source will include JSX code.
 * @returns ESLint config.
 */
const createSourceJSConfig = (isReact = false) => ({
  files: isReact ? ['src/**/*.{js,jsx}'] : ['src/**/*.js'],
  plugins: {
    ...basePlugins,
    ...(isReact ? { react, 'react-hooks': reactHooks } : {}),
  },
  languageOptions: {
    ...languageOptions,
    parser: babelParser,
    parserOptions: {
      ...reactParserOptions,
      ecmaFeatures: {
        ...reactParserOptions.ecmaFeatures,
        jsx: isReact,
      },
    },
    globals: {
      ...browserGlobals,
      ...srcGlobals,
    },
  },
  settings: isReact ? reactSettings : {},
  rules: {
    ...baseRules,
    ...(isReact ? reactRules : {}),
  },
});

const createSourceTSConfig = (isReact = false) => ({
  files: isReact ? ['src/**/*.tsx'] : ['src/**/*.ts'],
  plugins: {
    ...basePlugins,
    '@typescript-eslint': typescript,
    ...(isReact ? { react, 'react-hooks': reactHooks } : {}),
  },
  languageOptions: {
    ...languageOptions,
    parser: typescriptParser,
    parserOptions: {
      ...reactParserOptions,
      ...typedParserOptions,
      ecmaFeatures: {
        ...reactParserOptions.ecmaFeatures,
        ...typedParserOptions.ecmaFeatures,
        jsx: isReact,
      },
    },
    globals: {
      ...browserGlobals,
      ...srcGlobals,
    },
  },
  settings: isReact ? reactSettings : {},
  rules: {
    ...baseRules,
    ...typescriptRules,
    ...(isReact ? reactRules : {}),
  },
});

const createTestConfig = (isTypescript = false) => ({
  files: isTypescript
    ? [
        'src/**/__tests__/**/?(*.)+(spec|test).{ts,tsx}',
        'tools/tests/**/*.{ts,tsx}',
      ]
    : [
        'src/**/__tests__/**/?(*.)+(spec|test).{js,jsx}',
        'tools/tests/**/*.{js,jsx}',
      ],
  plugins: {
    ...basePlugins,
    jest,
    'jest-dom': jestDom,
    'testing-library': testingLibrary,
    ...(isTypescript ? { '@typescript-eslint': typescript } : {}),
    react,
    'react-hooks': reactHooks,
  },
  languageOptions: {
    ...languageOptions,
    parser: isTypescript ? typescriptParser : babelParser,
    parserOptions: {
      ...reactParserOptions,
      ...(isTypescript ? typedParserOptions : {}),
      ecmaFeatures: {
        ...reactParserOptions.ecmaFeatures,
        ...(isTypescript ? typedParserOptions.ecmaFeatures : {}),
        jsx: true,
      },
    },
    globals: {
      ...testGlobals,
      ...srcGlobals,
    },
  },
  settings: reactSettings,
  rules: {
    ...baseRules,
    ...(isTypescript ? typescriptRules : {}),
    ...reactRules,
    ...testRules,
  },
});

export default [
  // Ignores
  {
    ignores: [
      // third-party
      '**/node_modules/',
      // build output
      'dist/**',
      // test output
      'coverage/**',
    ],
  },

  // Tooling Configs
  createToolingConfig(false), // CJS scripts
  createToolingConfig(true), // ESM scripts
  createToolingConfig(true, true), // TS scripts

  // Source Configs
  createSourceJSConfig(), // Plain JS source
  createSourceJSConfig(true), // React JS source
  createSourceTSConfig(), // Plain TS source
  createSourceTSConfig(true), // React TS source

  // Test Configs
  createTestConfig(), // JS tests
  createTestConfig(true), // TS tests

  // Prettier
  // ALWAYS LAST: disable style rules that conflict with prettier
  // @see https://typescript-eslint.io/troubleshooting/formatting#suggested-usage---prettier
  {
    plugins: {
      prettier,
    },
    rules: prettier.rules,
  },
];
