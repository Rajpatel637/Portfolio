import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          className="theme-toggle-inner"
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ 
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {theme === 'dark' ? (
            <FaMoon className="theme-icon moon-icon" />
          ) : (
            <FaSun className="theme-icon sun-icon" />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Background circle animation */}
      <motion.div
        className="theme-toggle-bg"
        initial={false}
        animate={{
          scale: theme === 'dark' ? 1 : 1.15,
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)'
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.button>
  );
};

export default ThemeToggle;

