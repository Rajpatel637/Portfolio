import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaGithub, FaLinkedin } from 'react-icons/fa';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { socialLinks } from '../../data/portfolioData';
import './Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  const navItems = useMemo(() => [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);

      // Update active section based on scroll position
      const sections = navItems.map(item => document.getElementById(item.id));
      const currentSection = sections.find((section) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`navigation ${scrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav-container">
          {/* Logo */}
          <motion.div 
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            role="button"
            tabIndex={0}
            onClick={() => scrollToSection('hero')}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToSection('hero');
              }
            }}
            aria-label="Return to home"
          >
            <span className="logo-text">Portfolio</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="nav-menu" role="menubar">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                role="menuitem"
                aria-label={`Navigate to ${item.label} section`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    className="active-indicator"
                    layoutId="activeIndicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    aria-hidden="true"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="nav-actions">
            {/* Social Links */}
            <div className="nav-social">
              <motion.a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-social-link"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visit GitHub profile"
              >
                <FaGithub />
              </motion.a>
              <motion.a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-social-link"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visit LinkedIn profile"
              >
                <FaLinkedin />
              </motion.a>
            </div>

            <ThemeToggle />
            
            {/* Mobile Menu Toggle */}
            <motion.button
              className="mobile-toggle"
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            <div className="mobile-menu-content" role="menu">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(item.id)}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  role="menuitem"
                  aria-label={`Navigate to ${item.label} section`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;