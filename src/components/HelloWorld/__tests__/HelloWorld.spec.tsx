import { render, screen, a11yTest, act } from 'testingUtility';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { HelloWorld } from '../HelloWorld';

describe('/components/HelloWorld', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders the app title', () => {
    render(<HelloWorld />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('can say hello', async () => {
    render(<HelloWorld />);
    await act(async () => await user.click(screen.getByRole('button')));
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Say goodbye' })
    ).toBeInTheDocument();
  });

  it('is accessible', async () => {
    await a11yTest(<HelloWorld />);
  });
});
