import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Enhanced design tokens
export const designTokens = {
  colors: {
    dark: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      },
      secondary: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95'
      },
      accent: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b'
      },
      background: {
        primary: '#0a0a1b',
        secondary: '#12121f',
        tertiary: '#1a1a2e',
        elevated: '#1e1e30',
        overlay: 'rgba(10, 10, 27, 0.95)'
      },
      text: {
        primary: '#ffffff',
        secondary: '#e2e8f0',
        muted: '#94a3b8',
        inverse: '#0f172a',
        accent: '#38bdf8'
      },
      border: 'rgba(255, 255, 255, 0.08)',
      shadow: 'rgba(0, 0, 0, 0.6)'
    },
    light: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a'
      },
      secondary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87'
      },
      accent: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
      },
      background: {
        primary: '#ffffff',
        secondary: '#f9fafb',
        tertiary: '#f3f4f6',
        elevated: '#ffffff',
        overlay: 'rgba(255, 255, 255, 0.95)'
      },
      text: {
        primary: '#0f172a',
        secondary: '#334155',
        muted: '#64748b',
        inverse: '#ffffff',
        accent: '#2563eb'
      },
      border: 'rgba(0, 0, 0, 0.08)',
      shadow: 'rgba(0, 0, 0, 0.08)'
    }
  },
  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    secondary: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
    accent: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    mesh: 'radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)'
  },
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem'
  },
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      heading: '"Poppins", sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem'
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    }
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)'
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms'
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      // Check for saved preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;

      // Check system preference (safely handle test environment)
      try {
        if (typeof window.matchMedia === 'function') {
          const mq = window.matchMedia('(prefers-color-scheme: light)');
          if (mq && typeof mq.matches === 'boolean' && mq.matches) {
            return 'light';
          }
        }
      } catch (error) {
        // matchMedia not available or errored (e.g., in tests)
        return 'dark';
      }
    }
    return 'dark';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add transition class for smooth color changes
    document.documentElement.classList.add('theme-transitioning');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);
  };

  const currentColors = designTokens.colors[theme];

  useEffect(() => {
    const root = document.documentElement;
    const colors = currentColors;
    
    // Update CSS custom properties for primary colors
    root.style.setProperty('--primary-50', colors.primary[50]);
    root.style.setProperty('--primary-100', colors.primary[100]);
    root.style.setProperty('--primary-200', colors.primary[200]);
    root.style.setProperty('--primary-300', colors.primary[300]);
    root.style.setProperty('--primary-400', colors.primary[400]);
    root.style.setProperty('--primary-500', colors.primary[500]);
    root.style.setProperty('--primary-600', colors.primary[600]);
    root.style.setProperty('--primary-700', colors.primary[700]);
    root.style.setProperty('--primary-800', colors.primary[800]);
    root.style.setProperty('--primary-900', colors.primary[900]);
    
    // Update secondary colors
    root.style.setProperty('--secondary-400', colors.secondary[400]);
    root.style.setProperty('--secondary-500', colors.secondary[500]);
    root.style.setProperty('--secondary-600', colors.secondary[600]);
    
    // Update accent colors
    root.style.setProperty('--accent-400', colors.accent[400]);
    root.style.setProperty('--accent-500', colors.accent[500]);
    root.style.setProperty('--accent-600', colors.accent[600]);
    
    // Update backgrounds
    root.style.setProperty('--bg-primary', colors.background.primary);
    root.style.setProperty('--bg-secondary', colors.background.secondary);
    root.style.setProperty('--bg-tertiary', colors.background.tertiary);
    root.style.setProperty('--bg-elevated', colors.background.elevated);
    root.style.setProperty('--bg-overlay', colors.background.overlay);
    
    // Update text colors
    root.style.setProperty('--text-primary', colors.text.primary);
    root.style.setProperty('--text-secondary', colors.text.secondary);
    root.style.setProperty('--text-muted', colors.text.muted);
    root.style.setProperty('--text-inverse', colors.text.inverse);
    root.style.setProperty('--text-accent', colors.text.accent);
    
    // Update border and shadow
    root.style.setProperty('--border-color', colors.border);
    root.style.setProperty('--shadow-color', colors.shadow);

    // Add theme class to body for theme-specific styling
    document.body.className = document.body.className.replace(/theme-\w+/, '') + ` theme-${theme}`;
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colors.background.primary);
    }
  }, [theme, currentColors]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    if (!mediaQuery || typeof mediaQuery.addEventListener !== 'function') return;

    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        const matches = e && typeof e.matches === 'boolean' ? e.matches : mediaQuery.matches;
        setTheme(matches ? 'light' : 'dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    theme,
    toggleTheme,
    colors: currentColors,
    tokens: designTokens
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};