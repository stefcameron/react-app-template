//
// Use this module INSTEAD OF '@testing-library/react' since it re-exports
//  everything from the Testing Library, but provides an augmented render()
//  which wraps the 'ui' being tested into any necessary providers.
//

/* eslint-env browser -- this code is executed in the context of JSDom */

import { renderApp } from './testRenderers';

//
// EXPORTS
//

// re-export everything
export * from '@testing-library/react';

export { renderApp as render };

export * from './testRenderers';
export * from './testTools';
