import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Animation variants for consistent use across components
export const animationVariants = {
  // Fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },

  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },

  fadeInDown: {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },

  fadeInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },

  fadeInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },

  // Scale animations
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },

  scaleUp: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  },

  // Stagger container
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  // Stagger items
  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  },

  // Text reveal
  textReveal: {
    hidden: { opacity: 0, y: '100%' },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },

  // Slide animations
  slideInLeft: {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },

  slideInRight: {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },

  // Magnetic effect
  magnetic: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: 'easeInOut' }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1, ease: 'easeInOut' }
    }
  },

  // Floating animation
  floating: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  // Pulse animation
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  // Rotate animation
  rotate: {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  },

  // Gradient animation
  gradientShift: {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  // Button hover effects
  buttonHover: {
    rest: { 
      scale: 1, 
      y: 0,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    hover: { 
      scale: 1.02,
      y: -2,
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    tap: { 
      scale: 0.98,
      y: 0,
      transition: { duration: 0.1, ease: 'easeOut' }
    }
  },

  // Card hover effects
  cardHover: {
    rest: { 
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      z: 0
    },
    hover: { 
      scale: 1.03,
      rotateX: 5,
      rotateY: 5,
      z: 50,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }
};

// Custom hook for scroll-triggered animations
export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    margin: '0px 0px -50px 0px',
    amount: threshold
  });

  return { ref, isInView };
};

// Custom hook for parallax effect
export const useParallax = (offset = 50) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY * offset * 0.01;
};

// Custom hook for typewriter effect
export const useTypewriter = (words, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(word.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, currentWordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseTime]);

  return currentText;
};

// Smooth scrolling utility
export const smoothScrollTo = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

// Staggered children animation utility
export const staggerChildren = (delay = 0.1) => ({
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: delay
    }
  },
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren'
    }
  }
});

export default animationVariants;