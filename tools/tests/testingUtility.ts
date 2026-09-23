//
// Use this module INSTEAD OF '@testing-library/react' since it re-exports
//  everything from the Testing Library, but provides an augmented render()
//  which wraps the 'ui' being tested into any necessary providers.
//

import { renderApp } from './testRenderers';

//
// EXPORTS
//

// re-export everything
// eslint-disable-next-line import-x/export -- intentionally overriding `render` below
export * from '@testing-library/react';

// eslint-disable-next-line import-x/export -- intentionally overriding `render` above
export { renderApp as render };

export * from './testRenderers';
export * from './testTools';
