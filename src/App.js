import React, { lazy, Suspense, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import SEO from './components/SEO';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import Navigation from './components/Navigation/Navigation';
import Toast from './components/Toast/Toast';
import Hero from './components/Hero/Hero';
import { initPerformanceMonitoring } from './utils/performanceUtils';
import './App.css';
import './styles/accessibility.css';

// Lazy load non-critical components for better performance
const ParticleSystem = lazy(() => import('./components/ParticleSystem/ParticleSystem'));
const CustomCursor = lazy(() => import('./components/CustomCursor/CustomCursor'));
const InstallPrompt = lazy(() => import('./components/InstallPrompt/InstallPrompt'));
const About = lazy(() => import('./components/About/About'));
const Skills = lazy(() => import('./components/Skills/Skills'));
const Projects = lazy(() => import('./components/Projects/Projects'));
const Contact = lazy(() => import('./components/Contact/Contact'));

function App() {
  useEffect(() => {
    // Initialize performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      initPerformanceMonitoring();
    }
  }, []);
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <ToastProvider>
            <SEO />
            
            {/* Skip to Content Link for Accessibility */}
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>
            
            <div className="App">
              {/* Lazy load decorative components */}
              <Suspense fallback={null}>
                <CustomCursor />
                <ParticleSystem />
                <InstallPrompt />
              </Suspense>
              
              <Toast />
              
              {/* Navigation - Always loaded */}
              <Navigation />
              
              {/* Main Content */}
              <main id="main-content" tabIndex="-1">
                {/* Hero - Always visible first, no lazy loading */}
                <Hero />
                
                {/* Lazy load below-the-fold content */}
              <Suspense fallback={<LoadingSpinner />}>
                <About />
                <Skills />
                <Projects />
                <Contact />
              </Suspense>
            </main>
          </div>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;