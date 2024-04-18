/* eslint-env node */

//
// ESLint Flat Configuration
// @see https://eslint.org/docs/latest/use/configure/configuration-files
//

import globals from 'globals';
import babelParser from '@babel/eslint-parser';

//
// JS Files
//

const jsParserOptions = {
  ecmaFeatures: {
    impliedStrict: true,
  },
};

const jsRules = {
  //
  // Rules: pull-in ESLint's recommended set, then tweak as necessary
  // @see http://eslint.org/docs/rules/&lt;rule-name>
  //

  //// possible errors

  'no-regex-spaces': 'off',
  'no-await-in-loop': 'error',
  'no-async-promise-executor': 'error',
  'no-misleading-character-class': 'error',
  'no-unsafe-optional-chaining': 'error',

  //// best practices

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
  'no-new': 'off', // OFF to allow `myFunction(new RegExp('foo'))`, for example
  'no-new-func': 'error', // disallow `new Function(...)` to declare a new function
  'no-new-wrappers': 'error', // disallow `new Number/String/Boolean()`
  'no-throw-literal': 'error',
  'no-warning-comments': [
    'error',
    {
      terms: ['DEBUG', 'FIXME', 'HACK'],
      location: 'start',
    },
  ],

  //// strict mode

  strict: ['error', 'function'],

  //// variables

  'no-catch-shadow': 'error',
  'no-shadow': 'error',
  'no-unused-vars': [
    'error',
    {
      args: 'none',
      caughtErrors: 'none',
      vars: 'local', // allow unused globals because they're often AppsScript hooks/triggers like `onOpen`
    },
  ],
  'no-use-before-define': 'error',

  //// stylistic issues

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
  'prefer-arrow-callback': 'off',
  'prefer-const': 'error',
};

//
// React/JSX code
//

const reactParserOptions = {
  ecmaFeatures: {
    impliedStrict: true,
    jsx: true,
  },
};

const reactRules = {
  ...jsRules,

  //// React Plugin

  // not needed because we don't pre-compile React code, it just runs in the browser
  'react/react-in-jsx-scope': 'off',

  // referring to another component's `.propTypes` is dangerous because that
  //  property doesn't exist in in production builds as an optimization
  //  (this rule isn't enabled in 'plugin:react/recommended')
  'react/forbid-foreign-prop-types': 'error',

  //// React-Hooks Plugin

  // default is 'warn', prefer errors (warnings just get ignored)
  'react-hooks/exhaustive-deps': 'error',
};

//
// Test modules run by Jest in which RTL is used
//

const jestRtlRules = {
  ...reactRules,

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
// CONFIG
//

// default language options for non-source JS files (tools running in Node)
// @see https://eslint.org/docs/latest/use/configure/language-options
const languageOptions = {
  ecmaVersion: 'latest', // implies all relevant language globals
  sourceType: 'commonjs',
  parserOptions: jsParserOptions, // NOTE: default parser is 'espree'

  // NOTE: these are __in addition to__ all language globals from the specified `ecmaVersion`
  // @see https://eslint.org/docs/latest/use/configure/language-options#specifying-globals
  globals: {
    ...globals.node,
  },
};

export default [
  // project JavaScript files (tooling, etc.)
  {
    files: ['**/*.{js,mjs}'],
    ignores: ['src/**/*.*'],
    languageOptions,


    extends: jsExtends,
    parserOptions: {
      ...parserOptions,
      sourceType: 'script', // CJS
    },
    env,
    rules: {
      ...jsRules,
      'no-console': 'off',
    },
  },

  // React source files
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ...languageOptions,
      sourceType: 'module', // ESM

      // @see https://www.npmjs.com/package/@babel/eslint-plugin
      //  currently, none of the rules overridden in the plugin are enforced here
      parser: babelParser,

      parserOptions: reactParserOptions,
      globals: {
        ...globals.browser,
      },
    },

    rules: reactRules,
    // DEBUG what about settings: { react: { version: 'detect' } }? this may have moved elsewhere
    //  once the eslint-plugin-react gets updated to support ESLint v9
  },
];
