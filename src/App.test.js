import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// Mock all child components to simplify testing
jest.mock('./components/ParticleSystem/ParticleSystem', () => {
  return function ParticleSystem() {
    return <div data-testid="particle-system">Particle System</div>;
  };
});

jest.mock('./components/CustomCursor/CustomCursor', () => {
  return function CustomCursor() {
    return <div data-testid="custom-cursor">Custom Cursor</div>;
  };
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders skip to content link', () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('renders navigation component', () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders main content sections', () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveAttribute('id', 'main-content');
  });

  test('includes accessibility features', () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveAttribute('tabIndex', '-1');
  });
});
