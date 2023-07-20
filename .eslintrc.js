//
// ROOT ESLint Configuration
//

/* eslint-env node */

// @see https://eslint.org/docs/latest/use/configure/language-options#specifying-parser-options
const parserOptions = {
  ecmaFeatures: {
    impliedStrict: true,
  },
  ecmaVersion: 'latest', // probably overridden by `env.esXXXX` setting (docs are unclear)
  sourceType: 'module', // ESM
};

// @see https://eslint.org/docs/latest/use/configure/language-options#specifying-environments
const env = {
  es2024: true, // automatically sets `parserOptions.ecmaVersion` parser option to 15
  node: true,
};

const browserEnv = {
  ...env,
  browser: true,
  node: false,
};

const jestEnv = {
  ...browserEnv,
  'jest/globals': true,
};

// for all JavaScript files
const jsExtends = [
  'eslint:recommended',
  'prettier', // ALWAYS AFTER ESLINT: disable style rules that conflict with prettier
];

// for JS files with React/JSX code
const reactExtends = [
  ...jsExtends,
  'plugin:react/recommended',
  'plugin:react-hooks/recommended',

  // from eslint-plugin-react; disables rules no longer applicable when using React 17's
  //  new JSX Transform (react/jsx-uses-react, react/react-in-jsx-scope)
  'plugin:react/jsx-runtime',
];

// for test modules run by Jest and in which RTL is used
const jestExtends = [
  ...reactExtends,
  'plugin:jest-dom/recommended',
  'plugin:testing-library/react',
];

// for all JS files
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

// for modules with React/JSX code
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

// for test modules run by Jest in which RTL is used
const jestRules = {
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

// for React/JSX files
const reactSettings = {
  //// React Plugin

  // a version must be specified; here it's set to detect the current version
  react: {
    version: 'detect',
  },
};

// for test modules run by Jest
const jestSettings = {
  ...reactSettings,
  react: {
    ...reactSettings.react,
  },
};

module.exports = {
  root: true,
  overrides: [
    // project JavaScript files (tooling, etc.)
    {
      files: ['**/*.js'],
      excludedFiles: ['src/**/*.*'],
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
    {
      files: ['**/*.mjs'],
      excludedFiles: ['src/**/*.*'],
      extends: jsExtends,
      parserOptions,
      env,
      rules: {
        ...jsRules,
        'no-console': 'off',
      },
    },

    // source files
    {
      files: ['src/**/*.{js,jsx}'],

      // @see https://www.npmjs.com/package/@babel/eslint-plugin
      //  currently, none of the rules overridden in the plugin are enforced here
      plugins: ['@babel'],

      extends: reactExtends,
      parser: '@babel/eslint-parser',
      parserOptions: {
        ...parserOptions,
        ecmaFeatures: {
          ...parserOptions.ecmaFeatures,
          jsx: true,
        },
      },
      env: browserEnv,
      rules: reactRules,
      settings: reactSettings,
    },

    // test files
    {
      // match any file with a suffix of .test, or .spec; and with .js or .jsx
      //  extension; and just test.<ext> or spec.<ext>; as long as the file is inside
      //  a __test__ directory at any depth within the base path
      files: [
        'src/**/__tests__/**/?(*.)+(spec|test).{js,jsx}',
        'tools/tests/**/*.js',
      ],

      // @see https://www.npmjs.com/package/@babel/eslint-plugin
      //  currently, none of the rules overridden in the plugin are enforced here
      plugins: ['@babel', 'jest'],

      extends: jestExtends,
      parser: '@babel/eslint-parser',
      parserOptions: {
        ...parserOptions,
        ecmaFeatures: {
          ...parserOptions.ecmaFeatures,
          jsx: true,
        },
      },
      env: jestEnv,
      rules: jestRules,
      settings: jestSettings,
    },
  ],
};
