# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Stack: React 19, optional TypeScript, Webpack 5, Babel (JS), ts-loader (TS), Jest + React Testing Library, ESLint (flat config), Prettier
- Node: engines require ^20.11.0 or >=21.2.0 (Node 20 LTS recommended)
- Entry: src/index.js renders <App /> into src/index.html
- Global build constant: WP_BUILD_ENV is injected by Webpack (development in dev, production in prod) and is used in components for dev-only behavior

Common commands
- Install
  - npm install
  - CI installs via npm ci
- Run the dev server (opens browser to http://localhost:3000)
  - PORT=4000 npm start  # change port if needed
- Build
  - npm run build        # production build
  - npm run build:dev    # development-mode build
- Lint and format
  - npm run lint         # code lint + type-check + prettier check
  - npm run lint:code    # ESLint
  - npm run lint:types   # TypeScript (tsc --noEmit)
  - npm run fmt          # Prettier write
  - npm run fmt:check    # Prettier verify only
  - npm run verify       # fmt (write) + lint:code + lint:types
- Tests
  - npm test             # build + lint + coverage (Jest) — enforces 80% global thresholds
  - npm run test:unit    # run unit tests (Jest)
  - npm run test:coverage  # unit tests with coverage
- Run a single test
  - npm run test:unit -- src/components/HelloWorld/__tests__/HelloWorld.spec.tsx
  - npm run test:unit -- -t "Say .* goodbye"   # by test name (regex)
  - npm run test:unit -- --watch               # watch mode locally (avoid in CI)
- Template eject (clone this template into a new folder with deps installed and git initialized)
  - npm run eject -- ../my-new-app [--verbose]

Architecture and structure
- Application boot
  - src/index.js uses React 18+ createRoot to render <App /> and imports src/styles.css
  - HtmlWebpackPlugin uses src/index.html as the template (title/meta added in components)
- Components
  - Mixed JS and TSX components live under src/components
  - Example of TypeScript-first style: HelloWorld (PropsWithChildren, TSX)
  - Example of JS with dev-only runtime prop checks: WithoutPropTypes (uses rtvjs when WP_BUILD_ENV === 'development')
- Styling
  - Plain CSS is imported directly inside modules (e.g., import './MyComponent.css') and bundled with style-loader + css-loader
- Build system (webpack.config.mjs)
  - Entry: src/index.js; Output: dist with content-hashed bundles
  - Mode and devtool derive from NODE_ENV; development uses eval-source-map
  - JS via babel-loader (rootMode: 'upward' to pick up babel.config.js)
  - TS/TSX via ts-loader (uses tsconfig.json)
  - Assets handled via asset/resource; CSS via style-loader + css-loader
  - DefinePlugin injects WP_BUILD_ENV to gate dev/prod-only code
  - SplitChunks creates a vendor bundle for node_modules
  - Dev server: serves static/ at /static/, opens a preferred browser on macOS, port via PORT, overlays compile errors
  - Resolve: extensions .ts/.tsx/.js with extensionAlias to allow ESM-style imports
- TypeScript (tsconfig.json)
  - Strict settings; ESNext lib/target/module; moduleResolution: bundler
  - noEmit: false (ts-loader needs JS output; Babel handles JS separately)
  - Paths alias: "testingUtility" -> ./tools/tests/testingUtility.ts (kept in sync with ESLint, Jest)
  - Custom type roots include src/globals.d.ts (declares WP_BUILD_ENV) and tools/tests/globals.d.ts
- Testing (jest.config.mjs + tools/tests)
  - Environment: jsdom; transforms: babel-jest for JS, ts-jest for TS/TSX
  - transformIgnorePatterns whitelists rtvjs so it’s transpiled
  - testMatch: src/**/__tests__/**/?(*.)+(spec|test).{js,jsx,ts,tsx}
  - coverage: collected from src/**/[^.]*.{js,jsx,ts,tsx} with 80% global thresholds
  - moduleDirectories adds tools/tests for imports like 'testingUtility'; moduleNameMapper maps CSS to identity-obj-proxy
  - setupFilesAfterEnv: tools/tests/jestSetup.js adds @testing-library/jest-dom and jest-axe matchers
  - tools/tests/testingUtility.ts re-exports RTL and provides renderApp; tools/tests/testTools.ts includes a11yTest helper
- Linting (eslint.config.mjs)
  - Flat config with generators for: tooling scripts (CJS/ESM/TS), source (JS/TSX), and tests
  - Integrates @babel/eslint-parser, @typescript-eslint, plugin:import with alias and node/ts resolvers, react/react-hooks, jest/jest-dom/testing-library
  - Prettier config applied last to disable conflicting stylistic rules
  - Bundled globals include WP_BUILD_ENV (kept in sync with src/globals.d.ts and Jest globals)
- CI (GitHub Actions .github/workflows/ci.yml)
  - Node latest (check-latest), npm ci, then npm run ci:build, npm run ci:lint, npm run ci:test
  - CI=true to ensure non-interactive runs

Notes and conventions
- Port customization: set PORT before npm start (default 3000)
- Static assets: files in ./static are available at /static/ in the dev server only
- Test utilities: import from 'testingUtility' instead of '@testing-library/react' to get the app-aware render

