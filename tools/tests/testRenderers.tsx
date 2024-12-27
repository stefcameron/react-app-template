//
// All the various renderers for tests
//

/* eslint-env browser -- this code is executed in the context of JSDom */

import { ReactNode } from 'react';
import { RenderOptions, RenderResult, render } from '@testing-library/react';

export interface TestRenderer {
  (ui: ReactNode, options?: RenderOptions): RenderResult;
}

// Providers needed to render the App
const AppProviders = ({ children }: { children: ReactNode | ReactNode[] }) => {
  // wrap `children` into any necessary providers
  return <>{children}</>;
};

// normal render without a custom wrapper
export const renderRaw: TestRenderer = (
  ui: ReactNode,
  options?: RenderOptions
) => render(ui, options);

// App render with all its required providers
export const renderApp: TestRenderer = (
  ui: ReactNode,
  options?: RenderOptions
) =>
  renderRaw(ui, {
    wrapper: AppProviders,
    ...options,
  });
