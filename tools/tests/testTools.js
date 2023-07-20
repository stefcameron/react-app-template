//
// Common testing utilities
//

/* eslint-env browser -- this code is executed in the context of JSDom */

import { axe } from 'jest-axe';
import { renderApp } from './testRenderers';

/**
 * Performs an accessibility test on the specified component, using the specified
 *  render function.
 * @param {ReactComponent} ui Component to render.
 * @param {Function} [renderer=renderLightTheme] Render function, e.g. `render`, `renderRaw`,
 *  `renderLightTheme`, etc., to use to render the `ui` to HTML.
 * @param {Object} [options]
 * @param {Object} [options.render] Render options (per Testing Library).
 * @param {Object} [options.axe] AXE configuration options, same shape as
 *  https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
 * @param {({ view: Object }) => Promise} [options.beforeTest] Called __after_ render,
 *  but __before__ the AXE test is run. `view` is the object returned by the `renderer`
 *  function.
 */
export const a11yTest = async (
  ui,
  renderer = renderApp,
  { render: renderOpts, axe: axeOpts, beforeTest = () => {} } = {}
) => {
  const view = renderer(ui, renderOpts);
  await beforeTest({ view });
  const axeResults = await axe(view.container, axeOpts);
  expect(axeResults).toHaveNoViolations();
};
