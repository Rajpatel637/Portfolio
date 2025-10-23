import { render, screen, fireEvent } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Navigation from './Navigation';

describe('Navigation Component', () => {
  const renderNavigation = () => {
    return render(
      <HelmetProvider>
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      </HelmetProvider>
    );
  };

  test('renders navigation bar', () => {
    renderNavigation();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders logo', () => {
    renderNavigation();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    renderNavigation();
    expect(screen.getByRole('menuitem', { name: /navigate to home/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /navigate to about/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /navigate to skills/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /navigate to projects/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /navigate to contact/i })).toBeInTheDocument();
  });

  test('renders theme toggle', () => {
    renderNavigation();
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument();
  });

  test('renders mobile menu toggle', () => {
    renderNavigation();
    expect(screen.getByRole('button', { name: /mobile menu/i })).toBeInTheDocument();
  });

  test('opens mobile menu on toggle click', () => {
    renderNavigation();
    const toggleButton = screen.getByRole('button', { name: /open mobile menu/i });
    
    fireEvent.click(toggleButton);
    
    expect(screen.getByRole('dialog', { name: /mobile navigation/i })).toBeInTheDocument();
  });

  test('closes mobile menu when link is clicked', () => {
    renderNavigation();
    
    // Open mobile menu
    const toggleButton = screen.getByRole('button', { name: /open mobile menu/i });
    fireEvent.click(toggleButton);
    
    // Click a menu item
    const mobileLinks = screen.getAllByRole('menuitem');
    fireEvent.click(mobileLinks[0]);
    
    // Menu should close
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    renderNavigation();
    const nav = screen.getByRole('navigation');
    
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });

  test('logo is keyboard accessible', () => {
    renderNavigation();
    const logo = screen.getByRole('button', { name: /return to home/i });
    
    expect(logo).toHaveAttribute('tabIndex', '0');
  });
});
