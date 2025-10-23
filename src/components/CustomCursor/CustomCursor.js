import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  // Use motion values for smoother performance
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const trailX = useMotionValue(0);
  const trailY = useMotionValue(0);
  
  // Create smooth spring animations
  const springConfig = { 
    damping: 30, 
    stiffness: 300, 
    mass: 0.5,
    restSpeed: 0.001,
    restDelta: 0.001
  };
  
  const trailSpringConfig = { 
    damping: 25, 
    stiffness: 150, 
    mass: 0.8,
    restSpeed: 0.001,
    restDelta: 0.001
  };
  
  const smoothCursorX = useSpring(cursorX, springConfig);
  const smoothCursorY = useSpring(cursorY, springConfig);
  const smoothTrailX = useSpring(trailX, trailSpringConfig);
  const smoothTrailY = useSpring(trailY, trailSpringConfig);

  const lastUpdateTime = useRef(Date.now());
  const velocity = useRef({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId = null;
    let throttleTimer = null;
    
    const updateMousePosition = (e) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime.current;
      
      // Calculate velocity for smoother motion
      velocity.current = {
        x: (e.clientX - lastPosition.current.x) / (deltaTime || 1),
        y: (e.clientY - lastPosition.current.y) / (deltaTime || 1)
      };
      
      lastPosition.current = { x: e.clientX, y: e.clientY };
      lastUpdateTime.current = currentTime;
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        cursorX.set(e.clientX - 16);
        cursorY.set(e.clientY - 16);
        trailX.set(e.clientX - 4);
        trailY.set(e.clientY - 4);
      });
    };

    const updateCursorState = (e) => {
      // Throttle cursor state checks for better performance
      if (throttleTimer) return;
      
      throttleTimer = setTimeout(() => {
        const target = e.target;
        const isClickable = target.tagName === 'A' || 
                           target.tagName === 'BUTTON' || 
                           target.onclick || 
                           target.closest('a') || 
                           target.closest('button') ||
                           target.closest('[role="button"]') ||
                           getComputedStyle(target).cursor === 'pointer';
        
        setIsPointer(isClickable);
        throttleTimer = null;
      }, 50);
    };

    const hideCursor = () => setIsHidden(true);
    const showCursor = () => setIsHidden(false);

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseover', updateCursorState, { passive: true });
    window.addEventListener('mouseleave', hideCursor);
    window.addEventListener('mouseenter', showCursor);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', updateCursorState);
      window.removeEventListener('mouseleave', hideCursor);
      window.removeEventListener('mouseenter', showCursor);
    };
  }, [cursorX, cursorY, trailX, trailY]);

  // Don't render on mobile devices
  if (window.innerWidth <= 768) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="custom-cursor"
        style={{
          x: smoothCursorX,
          y: smoothCursorY,
          opacity: isHidden ? 0 : 1
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{
          scale: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
            mass: 0.5
          },
          opacity: { 
            duration: 0.15,
            ease: 'easeInOut'
          }
        }}
      >
        <motion.div
          className={`cursor-dot ${isPointer ? 'pointer' : ''}`}
          animate={{
            scale: isPointer ? 0.5 : 1
          }}
          transition={{ 
            type: 'spring',
            stiffness: 400,
            damping: 20,
            mass: 0.3
          }}
        />
      </motion.div>

      {/* Cursor trail */}
      <motion.div
        className="cursor-trail"
        style={{
          x: smoothTrailX,
          y: smoothTrailY,
          opacity: isHidden ? 0 : 0.6
        }}
        transition={{
          opacity: { 
            duration: 0.15,
            ease: 'easeInOut'
          }
        }}
      />
    </>
  );
};

export default CustomCursor;