//
// Generates a Jest Configuration
//

import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @returns {Object} The Jest configuration to use.
 */
const mkConfig = function () {
  const ignoredPaths = ['/node_modules/'];

  return {
    automock: false,
    verbose: true,

    testEnvironment: 'jsdom', // requires separate 'jest-environment-jsdom' package
    globals: {
      // none for now
    },
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '.+\\.(css|styl|less|sass|scss|png|jpg|svg|ttf|woff|woff2|otf)$':
        'jest-transform-stub',
    },
    transformIgnorePatterns: [
      // whitelist specific packages under node_modules (the entirety of which
      //  is ignored by Jest by default) that are shipped as ES6-only and need
      //  to be transpiled via 'babel-jest' configured in the 'transform' option
      // @see https://github.com/facebook/jest/issues/9292#issuecomment-569673251
      'node_modules/(?!(' +
        // 'first-lib' +
        // '|other-lib' +
        ')/)',
    ],

    // NOTE: paths are relative from where Jest is run
    collectCoverageFrom: [
      'src/**/[^.]*.{js,jsx}', // ignore .files like .eslintrc.js with `/[^.]` in this glob pattern
    ],
    coverageDirectory: './coverage',

    // NOTE: paths are ABSOLUTE, unless they begin with a globstar (**)
    testMatch: [
      // match any file with a suffix of .test, or .spec; and with .js or .jsx
      //  extension; and just test.<ext> or spec.<ext>; as long as the file is inside
      //  a __test__ directory at any depth within the base path
      `${path.resolve(
        __dirname
      )}/src/**/__tests__/**/?(*.)+(spec|test).{js,jsx}`,
    ],

    // NOTE: to truly ignore paths, we have to ignore them both for tests and
    //  coverage; just ignoring for tests will still result in those paths being
    //  loaded and transpiled for (unnecessary) coverage evaluation
    coveragePathIgnorePatterns: ignoredPaths,
    testPathIgnorePatterns: ignoredPaths,

    moduleDirectories: [
      'node_modules',

      // NOTE: This entry makes it possible for `*.spec.js` files to reference
      //  the `./testingUtility.js` module in the /tools/tests directory __without__
      //  using (potentially very long) relative directory paths, just as
      //  `import { render } from 'testingUtility'` because `__dirname` will
      //  always be the directory where this (jest.config.js) is located.
      // @see https://testing-library.com/docs/react-testing-library/setup#configuring-jest-with-test-utils
      //  for the configuration pattern.
      path.resolve(__dirname, './tools/tests'),
    ],

    setupFilesAfterEnv: [path.resolve(__dirname, './tools/tests/jestSetup.js')],
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },
  };
};

export default mkConfig();
