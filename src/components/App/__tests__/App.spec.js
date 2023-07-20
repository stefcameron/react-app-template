import { render, screen, a11yTest } from 'testingUtility';
import { App } from '../App';

describe('/components/App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('React App')).toBeInTheDocument();
  });

  it('is accessible', async () => {
    await a11yTest(<App />);
  });
});
