//
// All the various renderers for tests
//

/* eslint-env browser -- this code is executed in the context of JSDom */

import propTypes from 'prop-types';
import { render } from '@testing-library/react';

// Providers needed to render the App
const AppProviders = function ({ children }) {
  // wrap `children` into any necessary providers
  return <>{children}</>;
};

AppProviders.propTypes = {
  children: propTypes.oneOfType([
    propTypes.node,
    propTypes.arrayOf(propTypes.node),
  ]),
};

// normal render without a custom wrapper
export const renderRaw = (ui, options) => render(ui, options);

// App render with all its required providers
export const renderApp = (ui, options) =>
  renderRaw(ui, {
    wrapper: AppProviders,
    ...options,
  });
