import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDownload, FaMobile } from 'react-icons/fa';
import './InstallPrompt.css';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000); // Show after 3 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ PWA installed successfully!');
      }
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`User response to install prompt: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      } else {
        console.log('❌ User dismissed the install prompt');
      }
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for 7 days
    const dismissUntil = Date.now() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('pwa-install-dismissed', dismissUntil.toString());
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          className="install-prompt"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <button
            className="install-prompt-close"
            onClick={handleDismiss}
            aria-label="Close install prompt"
          >
            <FaTimes />
          </button>

          <div className="install-prompt-content">
            <div className="install-prompt-icon">
              <FaMobile />
            </div>
            
            <div className="install-prompt-text">
              <h3>Install Portfolio App</h3>
              <p>Add to your home screen for quick access and offline use!</p>
            </div>

            <button
              className="install-prompt-button"
              onClick={handleInstall}
              aria-label="Install portfolio app"
            >
              <FaDownload />
              Install
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
