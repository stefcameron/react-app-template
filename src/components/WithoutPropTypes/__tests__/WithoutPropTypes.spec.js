import { render, a11yTest } from 'testingUtility';
import { WithoutPropTypes } from '../WithoutPropTypes';

describe('/components/WithoutPropTypes', () => {
  it('renders when visible=true', () => {
    render(<WithoutPropTypes visible />);
    expect(
      document.querySelector('section.without-prop-types')
    ).toBeInTheDocument();
  });

  it('does not render by default', () => {
    render(<WithoutPropTypes />);
    expect(
      document.querySelector('section.without-prop-types')
    ).not.toBeInTheDocument();
  });

  it('is accessible', async () => {
    await a11yTest(<WithoutPropTypes visible />);
  });
});
