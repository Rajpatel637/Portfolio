import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle Component', () => {
  const renderWithTheme = () => {
    return render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
  };

  test('renders theme toggle button', () => {
    renderWithTheme();
    const button = screen.getByRole('button', { name: /switch to/i });
    expect(button).toBeInTheDocument();
  });

  test('toggles theme when clicked', () => {
    renderWithTheme();
    const button = screen.getByRole('button', { name: /switch to/i });
    
    // Initial state should be dark theme
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('light mode'));
    
    // Click to toggle
    fireEvent.click(button);
    
    // Should now be light theme
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('dark mode'));
  });

  test('displays correct icon for current theme', () => {
    renderWithTheme();
    const button = screen.getByRole('button');
    
    // Should have moon icon initially (dark theme)
    expect(button.querySelector('.moon-icon')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    renderWithTheme();
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('title');
  });
});
