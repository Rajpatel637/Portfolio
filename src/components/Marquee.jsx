import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../motion';

export default function Marquee() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !marqueeRef.current) return;
    
    const container = marqueeRef.current;
    const track = container.querySelector('.marquee-track');
    
    // Duplicate the content so we can loop seamlessly
    const content = track.innerHTML;
    track.innerHTML = content + content;
    
    const tl = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 25,
      repeat: -1
    });

    const onEnter = () => tl.pause();
    const onLeave = () => tl.play();

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      tl.kill();
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const items = [
    "OPEN TO OPPORTUNITIES", "•",
    "FULL-STACK DEV", "•",
    "AI/ML ENGINEER", "•",
    "CREATIVE DEVELOPER", "•"
  ];

  return (
    <div ref={marqueeRef} style={{
      width: '100vw',
      overflow: 'hidden',
      padding: '2rem 0',
      background: 'rgba(198,255,0,0.03)',
      borderTop: '1px solid rgba(198,255,0,0.1)',
      borderBottom: '1px solid rgba(198,255,0,0.1)',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="marquee-track" style={{
        display: 'flex',
        width: 'fit-content',
        whiteSpace: 'nowrap',
        willChange: 'transform'
      }}>
        <div style={{ display: 'flex', gap: '3rem', paddingRight: '3rem' }}>
          {items.map((item, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: item === '•' ? 'var(--accent)' : 'transparent',
              WebkitTextStroke: item === '•' ? 'none' : '1px rgba(255,255,255,0.4)',
              letterSpacing: '0.05em',
              lineHeight: 1
            }}>
              {item}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
