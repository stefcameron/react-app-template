import { HelloWorld } from '../HelloWorld/HelloWorld';
import { StylePreview } from '../StylePreview/StylePreview';
import { WithoutPropTypes } from '../WithoutPropTypes/WithoutPropTypes';
import './App.css';

export const App = () => {
  return (
    <div className="app">
      <title>{`${document.title} App Template`}</title>
      <meta name="keywords" content="react, template, typescript, javascript" />
      <section>
        <p>React App Template</p>
        <HelloWorld message="Hello, world!">
          <p>
            {WP_BUILD_ENV === 'development'
              ? '{Dev build}'
              : /* istanbul ignore next: cannot be tested */ '{Prod build}'}
          </p>
        </HelloWorld>
      </section>
      <WithoutPropTypes visible />
      <StylePreview />
    </div>
  );
};
