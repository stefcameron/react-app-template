import { HelloWorld } from '../HelloWorld/HelloWorld';
import { StylePreview } from '../StylePreview/Preview';
import './App.css';

export const App = () => {
  return (
    <div className="app">
      <section>
        <p>React App Template</p>
        <HelloWorld />
      </section>
      <StylePreview />
    </div>
  );
};
