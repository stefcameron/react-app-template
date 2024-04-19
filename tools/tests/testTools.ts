//
// Common testing utilities
//

/* eslint-env browser -- this code is executed in the context of JSDom */

import { ReactNode } from 'react';
import { JestAxeConfigureOptions, axe } from 'jest-axe';
import { RenderOptions, RenderResult } from '@testing-library/react';
import { TestRenderer, renderApp } from './testRenderers';

export interface A11yTestOptions {
  /**
   * Render options (per Testing Library).
   */
  render?: RenderOptions;
  /**
   * AXE configuration options, same shape as
   *  https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
   */
  axe?: JestAxeConfigureOptions;
  /**
   * Called __after_ render, but __before__ the AXE test is run. `view` is the object
   *  returned by the specified `renderer` function.
   */
  beforeTest?: (params?: { view: RenderResult }) => void | Promise<void>;
}

/**
 * Performs an accessibility test on the specified component, using the specified
 *  render function.
 * @param ui Component to render.
 * @param renderer Render function, e.g. `render`, `renderRaw`, `renderApp`, etc.,
 *  to use to render the `ui` to HTML.
 */
export const a11yTest = async (
  ui: ReactNode,
  renderer: TestRenderer = renderApp,
  {
    render: renderOpts,
    axe: axeOpts,
    beforeTest = () => {},
  }: A11yTestOptions = {}
) => {
  const view = renderer(ui, renderOpts);
  await beforeTest({ view });
  const axeResults = await axe(view.container, axeOpts);
  expect(axeResults).toHaveNoViolations();
};
