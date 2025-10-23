import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ParticleSystem.css';

const ParticleSystem = ({ 
  particleCount = 100,
  connectionDistance = 150,
  mouseInfluence = 200,
  animationSpeed = 0.5,
  particleSize = 2,
  opacity = 0.6,
  interactive = true,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const particlesRef = useRef([]);
  const [isVisible, setIsVisible] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);
  
  const { theme } = useTheme();

  // Particle class
  const createParticle = useCallback((canvas) => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * animationSpeed,
      vy: (Math.random() - 0.5) * animationSpeed,
      originalVx: (Math.random() - 0.5) * animationSpeed,
      originalVy: (Math.random() - 0.5) * animationSpeed,
      size: Math.random() * particleSize + 1,
      opacity: Math.random() * opacity + 0.1,
      hue: Math.random() * 60 + (theme === 'dark' ? 200 : 180), // Blue-purple range
    };
  }, [animationSpeed, particleSize, opacity, theme]);

  // Initialize particles
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const actualParticleCount = performanceMode ? Math.floor(particleCount * 0.6) : particleCount;
    particlesRef.current = Array.from({ length: actualParticleCount }, () => createParticle(canvas));
  }, [particleCount, createParticle, performanceMode]);

  // Mouse event handlers
  const handleMouseMove = useCallback((event) => {
    if (!interactive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      isActive: true
    };
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.isActive = false;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!interactive) return;
    mouseRef.current.isActive = true;
  }, [interactive]);

  // Update particle based on mouse interaction
  const updateParticleWithMouse = useCallback((particle) => {
    if (!mouseRef.current.isActive || !interactive) return;

    const dx = mouseRef.current.x - particle.x;
    const dy = mouseRef.current.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouseInfluence) {
      const force = (mouseInfluence - distance) / mouseInfluence;
      const angle = Math.atan2(dy, dx);
      
      // Repel particles from mouse
      particle.vx -= Math.cos(angle) * force * 0.5;
      particle.vy -= Math.sin(angle) * force * 0.5;
      
      // Add some attraction for more dynamic movement
      if (distance > mouseInfluence * 0.3) {
        particle.vx += Math.cos(angle) * force * 0.1;
        particle.vy += Math.sin(angle) * force * 0.1;
      }
    }
  }, [mouseInfluence, interactive]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !isVisible) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }

    // Clear canvas with slight trail effect
    ctx.fillStyle = theme === 'dark' 
      ? 'rgba(17, 24, 39, 0.05)' 
      : 'rgba(248, 250, 252, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;

    // Update and draw particles
    particles.forEach((particle, i) => {
      // Mouse interaction
      updateParticleWithMouse(particle);

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Restore original velocity gradually
      particle.vx += (particle.originalVx - particle.vx) * 0.01;
      particle.vy += (particle.originalVy - particle.vy) * 0.01;

      // Boundary conditions with smooth wrapping
      if (particle.x < 0) {
        particle.x = canvas.width;
      } else if (particle.x > canvas.width) {
        particle.x = 0;
      }

      if (particle.y < 0) {
        particle.y = canvas.height;
      } else if (particle.y > canvas.height) {
        particle.y = 0;
      }

      // Draw particle
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      
      // Gradient particle
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      
      gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, 1)`);
      gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw connections (optimized for performance)
      if (!performanceMode) {
        for (let j = i + 1; j < particles.length; j++) {
          const particle2 = particles[j];
          const dx = particle.x - particle2.x;
          const dy = particle.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const alpha = (1 - distance / connectionDistance) * 0.3 * particle.opacity;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = `hsla(${(particle.hue + particle2.hue) / 2}, 50%, 60%, 1)`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    });

    animationFrameId.current = requestAnimationFrame(animate);
  }, [theme, isVisible, updateParticleWithMouse, connectionDistance, performanceMode]);

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Recreate particles for new dimensions
    initParticles();
  }, [initParticles]);

  // Performance monitoring
  const monitorPerformance = useCallback(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkFPS = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Enable performance mode if FPS is low
        if (fps < 30 && !performanceMode) {
          setPerformanceMode(true);
          console.log('ParticleSystem: Enabled performance mode due to low FPS');
        } else if (fps > 50 && performanceMode) {
          setPerformanceMode(false);
          console.log('ParticleSystem: Disabled performance mode due to good FPS');
        }
      }
      
      requestAnimationFrame(checkFPS);
    };
    
    checkFPS();
  }, [performanceMode]);

  // Intersection Observer for visibility optimization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Setup and initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Initialize particles
    initParticles();

    // Setup event listeners
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      canvas.addEventListener('mouseenter', handleMouseEnter);
    }

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Start performance monitoring
    monitorPerformance();

    return () => {
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('mouseenter', handleMouseEnter);
      }
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [
    animate,
    handleMouseMove,
    handleMouseLeave,
    handleMouseEnter,
    handleResize,
    initParticles,
    interactive,
    monitorPerformance
  ]);

  // Theme change handler
  useEffect(() => {
    initParticles(); // Recreate particles with new colors when theme changes
  }, [theme, initParticles]);

  // Memoized canvas props
  const canvasProps = useMemo(() => ({
    ref: canvasRef,
    className: `particle-canvas ${className}`,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: interactive ? 'auto' : 'none',
      zIndex: -1,
    }
  }), [className, interactive]);

  return (
    <div className="particle-system">
      <canvas {...canvasProps} />
      
      {/* Performance indicator (dev mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="performance-indicator">
          <div className={`performance-badge ${performanceMode ? 'performance-mode' : 'normal-mode'}`}>
            {performanceMode ? 'Performance Mode' : 'Normal Mode'}
          </div>
          <div className="particle-count">
            Particles: {particlesRef.current.length}
          </div>
        </div>
      )}
    </div>
  );
};

// Higher-order component for easy integration
export const withParticles = (WrappedComponent, particleProps = {}) => {
  return function WithParticlesComponent(props) {
    return (
      <div className="with-particles-container">
        <ParticleSystem {...particleProps} />
        <WrappedComponent {...props} />
      </div>
    );
  };
};

// Preset configurations
export const ParticlePresets = {
  subtle: {
    particleCount: 50,
    connectionDistance: 100,
    mouseInfluence: 150,
    animationSpeed: 0.3,
    particleSize: 1.5,
    opacity: 0.4,
    interactive: true
  },
  
  dynamic: {
    particleCount: 120,
    connectionDistance: 180,
    mouseInfluence: 250,
    animationSpeed: 0.8,
    particleSize: 2.5,
    opacity: 0.7,
    interactive: true
  },
  
  minimal: {
    particleCount: 30,
    connectionDistance: 80,
    mouseInfluence: 100,
    animationSpeed: 0.2,
    particleSize: 1,
    opacity: 0.3,
    interactive: false
  },
  
  interactive: {
    particleCount: 80,
    connectionDistance: 160,
    mouseInfluence: 300,
    animationSpeed: 0.6,
    particleSize: 2,
    opacity: 0.6,
    interactive: true
  }
};

export default ParticleSystem;