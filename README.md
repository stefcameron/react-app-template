# React App Template [![CI](https://github.com/stefcameron/react-app-template/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/stefcameron/react-app-template/actions?query=workflow:CI+branch:master) [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

My own "create react app" with a stack that I find works well, is easy to
understand, and doesn't need to be ejected in order to get into its guts
and figure out why it isn't working if something comes up.

- Framework: [React](https://react.dev/)
- Styling: Pure CSS styles
  - Simply import your `.css` files into modules that use them.
  - Use the `classnames` package (`import classnames from 'classnames'`) to combine classes.
- Test runner: [Jest](https://jestjs.io/)
- Testing framework: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
  - All the tools come through the "global" `import { ... } from 'testingUtility'` module which
    can be imported from anywhere (path is aliased in Jest config).
  - Includes [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom) extensions.
- Lint: [ESLint](https://eslint.org/)
  - Configured for the browser in `/src`, for Jest in `/src/**/__tests__` directories, and for
    node everywhere else.
  - Using the latest (currently `es2024`) syntax.
- Formatting: [Prettier](https://prettier.io/)
- Bundling: [Webpack](https://webpack.js.org/)

## Running

Using the latest stable version of Node (v20) and NPM (v9.6)...

```bash
$ npm install
# installs all dependencies
$ npm start
# opens a browser to localhost:3000
# set PORT=XXXX in env to run on a different port

$ npm fmt
# formats the code using Prettier
$ npm build
# builds the production bundle
$ npm build:dev
# builds the development bundle
```

> 💬 If your browser doesn't open, please open it manually to `localhost:3000`

## Testing

```bash
$ npm test
# checks formatting, linting, build, and tests
$ npm run test:unit
# runs unit tests only
$ npm run lint
# runs ESLint
$ npm run fmt:check
# runs Prettier in verification mode only
```

## Styles

Pure CSS, just `import './MyComponent.styles.css'` in your component's module
the styles will get loaded whenever/if ever the module is loaded at runtime.

See `./src/components/App/App.js` for an example.
