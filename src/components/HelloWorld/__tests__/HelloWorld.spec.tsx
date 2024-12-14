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
    const message = 'Hello, world!';
    render(<HelloWorld message={message} />);

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Say goodbye' })
    ).toBeInTheDocument();

    await act(async () => await user.click(screen.getByRole('button')));

    expect(screen.queryByText(message)).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Say hello' })
    ).toBeInTheDocument();
  });

  it('is accessible', async () => {
    await a11yTest(<HelloWorld />);
  });
});
