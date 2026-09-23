//
// Source-specific globals
//
// NOTE: make sure global *constants* are also defined in <repo>/.eslintrc.js's
//  `srcGlobals` object, as well as in the `globals` property of
//  <repo>/jest.config.mjs
//

declare const WP_BUILD_ENV: string;

// side-effect CSS imports (e.g. `import './HelloWorld.css'`), handled at build time
//  by css-loader/style-loader, need an ambient module declaration for the type checker
declare module '*.css';
