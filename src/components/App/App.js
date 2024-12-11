import { HelloWorld } from '../HelloWorld/HelloWorld';
import { StylePreview } from '../StylePreview/Preview';
import './App.css';

export const App = () => {
  return (
    <div className="app">
      <title>{`${document.title} App Template`}</title>
      <meta name="keywords" content="react, template, typescript, javascript" />
      <section>
        <p>React App Template</p>
        <HelloWorld />
      </section>
      <StylePreview />
    </div>
  );
};
