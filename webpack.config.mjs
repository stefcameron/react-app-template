//
// WEBPACK build configuration
//
// ENV:
//
// - ST_PORT (number): If specified, the dev server will run on the specified port;
//     default is 3000.
//

import fs from 'fs';
import path from 'path';
import url from 'url';
import process from 'process';
import { createRequire } from 'module';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { cloneDeep } from 'lodash-es';

//
// Variables and Constants
//

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

//
// Functions
//

/**
 * Determines the configuration value to use for the Webpack Dev Server's
 *  `open` option depending on OS and what browser is available.
 */
const getOpenConfig = function () {
  // NOTE: Obviously, this is not complete. It's just targetting some popular macOS browsers
  // @see https://webpack.js.org/configuration/dev-server/#devserveropen for more
  //  information on what string to return for a specific browser on a specific OS

  let app = true; // open default browser if app not found
  if (process.platform === 'darwin') {
    // prefer Canary and then Chrome if either one is installed; then Edge since
    //  it's still Chromium, then FF; these are our 3 supported browsers
    if (fs.existsSync('/Applications/Google Chrome Canary.app')) {
      app = 'Google Chrome Canary';
    } else if (fs.existsSync('/Applications/Google Chrome.app')) {
      app = 'Google Chrome';
    } else if (fs.existsSync('/Applications/Microsoft Edge.app')) {
      app = 'Microsoft Edge';
    } else if (fs.existsSync('/Applications/Firefox.app')) {
      app = 'Firefox';
    }
  }

  return {
    app,
  };
};

const loadBabelConfig = function () {
  const filepath = path.resolve(__dirname, './babel.config.js');

  // NOTE: we must use inline `require()` statements since the Babel config
  //  files are JS files; we need to not only read them, but evaluate them
  //  as JS in order to get the object we're seeking
  // NOTE: clone because `require()` caches after the first read/load, and we want
  //  to make sure we always return a brand new object to avoid inadvertent
  //  overwrites from one build config to the next
  const config = cloneDeep(require(filepath)); // eslint-disable-line global-require

  // check for env overrides
  const babelEnv = process.env.BABEL_ENV || 'build';
  if (config.env) {
    if (config.env[babelEnv]) {
      // when normally loaded by Babel with BABEL_ENV set, Babel will take the env
      //  config as a set of overrides and merge it into the root config; we can
      //  achieve the same here by taking the env config and moving it into an
      //  'overrides' section in the root Babel config
      const overrides = config.overrides || [];
      overrides.push(config.env[babelEnv]);
      config.overrides = overrides; // re-assign same (no change) or define new property
    }

    delete config.env; // no longer needed in this context
  }

  return config;
};

/**
 * @returns {Object} Webpack build configuration.
 */
const mkConfig = function () {
  const outputPath = path.resolve(__dirname, './dist');
  const indexPath = path.resolve(__dirname, './src/index.html');
  const port = parseInt(process.env.ST_PORT ?? 3000);
  const isDevBuild = process.env.NODE_ENV === 'development';

  return {
    name: 'react-app',
    mode: isDevBuild ? 'development' : 'production',
    devtool: isDevBuild ? 'eval-source-map' : undefined,
    entry: path.resolve(__dirname, './src/index.js'),

    output: {
      path: outputPath,
      filename: '[name].bundle.[fullhash].js',
    },

    // NO `externals`: we bundle _everything_

    watchOptions: {
      // @see https://webpack.js.org/configuration/watch/
      ignored: ['node_modules/**', 'dist/**', '**/*.spec.js', '**/*.test.js'],
    },

    optimization: {
      // generate vendor chunks to keep the main chunk leaner for easier build debugging
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            enforce: true,
          },
        },
      },
    },

    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            // NOTE: babel.config.js won't get loaded automatically by the loader because it's
            //  a JS file; the loader only auto-loads babelrc (JSON-based) files
            options: loadBabelConfig(),
          },
        },

        {
          // import css files as URLs and resolve any @import or url() CSS directives
          // @see https://www.npmjs.com/package/style-loader
          // @see https://www.npmjs.com/package/css-loader
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },

        {
          // bundle any assets
          // @see https://webpack.js.org/guides/asset-modules/
          test: /\.(png|jpe?g|gif|svg|otf|ttf)$/i,
          type: 'asset/resource',
        },
      ],
    },

    // NOTE: plugins are executed in the order specified, first to last (unlike
    //  loaders that are executed in REVERSE order)
    //  @see https://stackoverflow.com/questions/41470771/webpack-does-the-order-of-plugins-matter
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: indexPath,
        hash: true,
        inject: 'body',
      }),
    ],

    // webpack-dev-server configuration
    devServer: {
      // configure any static assets to be served under the /static path in the browser
      static: {
        directory: path.resolve(__dirname, './src'),
        publicPath: '/static/',
        watch: true,
      },
      host: 'localhost',
      port,
      open: getOpenConfig(),
      historyApiFallback: true,
    },
  };
};

export default mkConfig();
