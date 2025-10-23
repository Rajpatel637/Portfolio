import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown, FaDownload } from 'react-icons/fa';
import { personalInfo } from '../../data/portfolioData';
import { useTypewriter, animationVariants } from '../../utils/animationUtils';
import { trackResumeDownload } from '../../utils/analytics';
import { useToast } from '../../contexts/ToastContext';
import './Hero.css';

const Hero = React.memo(() => {
  const { success, error } = useToast();
  
  const titles = useMemo(() => [
    'Full Stack Developer',
    'React Enthusiast',
    'Problem Solver',
    'Creative Thinker'
  ], []);

  // Use the custom typewriter hook
  const currentText = useTypewriter(titles, 100, 50, 2000);

  const scrollToNext = useCallback(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleResumeDownload = useCallback(() => {
    try {
      // Track the download
      trackResumeDownload();
      
      // Check if resume exists
      const resumePath = personalInfo.resumeUrl;
      
      if (!resumePath || resumePath === '/assets/documents/resume.pdf') {
        error('Resume not available yet. Please check back soon!');
        if (process.env.NODE_ENV === 'development') {
          console.warn('Resume file not configured. Update personalInfo.resumeUrl in portfolioData.js');
        }
        return;
      }
      
      // Open resume in new tab
      window.open(resumePath, '_blank', 'noopener,noreferrer');
      success('Opening resume...');
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Resume download error:', err);
      }
      error('Failed to open resume. Please try again.');
    }
  }, [success, error]);

  const handleProjectsScroll = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Enhanced animation variants (memoized)
  const containerVariants = useMemo(() => animationVariants.staggerContainer, []);
  const itemVariants = useMemo(() => animationVariants.fadeInUp, []);


  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Greeting */}
          <motion.div className="hero-greeting" variants={itemVariants}>
            <span className="greeting-text">Hello, I'm</span>
          </motion.div>

          {/* Name */}
          <motion.h1 className="hero-name" variants={itemVariants}>
            <span className="name-text gradient-text">{personalInfo.name}</span>
          </motion.h1>

          {/* Dynamic Title */}
          <motion.div className="hero-title-container" variants={itemVariants}>
            <h2 className="hero-title">
              <span className="title-prefix">I'm a </span>
              <span className="typing-text">{currentText}</span>
              <span className="typing-cursor">|</span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p className="hero-description" variants={itemVariants}>
            {personalInfo.bio}
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div className="hero-actions" variants={itemVariants}>
            <motion.button
              className="btn btn-primary btn-large"
              onClick={handleProjectsScroll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Navigate to projects section"
            >
              View My Work
            </motion.button>
            <motion.button
              className="btn btn-secondary btn-large"
              onClick={handleResumeDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Download resume PDF"
            >
              <FaDownload aria-hidden="true" />
              Download CV
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <motion.button
              className="scroll-btn"
              onClick={scrollToNext}
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaArrowDown />
            </motion.button>
            <span className="scroll-text">Scroll Down</span>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="hero-decorations">
          <motion.div
            className="decoration decoration-1"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          <motion.div
            className="decoration decoration-2"
            animate={{
              rotate: [360, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          <motion.div
            className="decoration decoration-3"
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;