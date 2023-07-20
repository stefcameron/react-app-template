import { createRoot } from 'react-dom/client';
import { App } from './components/App/App';
import './styles.css';

const reactRoot = createRoot(document.getElementById('root'));
reactRoot.render(<App />);
