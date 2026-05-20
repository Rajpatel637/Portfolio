import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DATA } from '../data';
import { prefersReducedMotion } from '../motion';

gsap.registerPlugin(ScrollTrigger);

function CircularProgress({ target, max = 10, label, suffix = "" }) {
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: circleRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: 'power3.out',
          onUpdate: () => {
            if (textRef.current) {
              textRef.current.textContent = Math.round(obj.val * 10) / 10 + suffix;
            }
            if (circleRef.current) {
              const progress = obj.val / max;
              const dashoffset = 251.2 * (1 - progress);
              circleRef.current.style.strokeDashoffset = dashoffset;
            }
          }
        });
      }
    });
  }, [target, max, suffix]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{ position: 'relative', width: '90px', height: '90px' }}>
        <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
          {/* Outer scanning ring */}
          <circle
            cx="50" cy="50" r="47"
            stroke="var(--glow)"
            strokeWidth="1"
            fill="transparent"
            strokeDasharray="4 6"
            style={{
              animation: 'spinRing 10s linear infinite',
              transformOrigin: '50px 50px',
            }}
          />
          {/* Inner track */}
          <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="transparent" />
          {/* Progress arc */}
          <circle
            ref={circleRef}
            cx="50" cy="50" r="40"
            stroke="var(--accent)"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset="251.2"
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s', filter: 'drop-shadow(0 0 8px var(--glow))' }}
          />
        </svg>
        <span
          ref={textRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.25rem',
            color: 'var(--white)',
            fontWeight: '600'
          }}
        >
          0{suffix}
        </span>
      </div>
      <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-body)', letterSpacing: '0.15em', color: 'var(--text-muted)', textAlign: 'center' }}>
        {label}
      </span>
    </div>
  );
}

export default function About() {
  const secRef = useRef(null);
  const wordsRef = useRef(null);
  const avatarCardRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set('.about-label, .about-heading, .bento-card, .word', {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0
      });
      return;
    }

    const ctx = gsap.context(() => {
      // section label slide in
      gsap.fromTo('.about-label', { x: -40, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.7,
        scrollTrigger: { trigger: secRef.current, start: 'top 80%', once: true }
      });
      gsap.fromTo('.about-heading', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: secRef.current, start: 'top 75%', once: true }
      });

      // Bento cards entrance stagger
      gsap.fromTo('.bento-card', 
        { y: 50, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.12, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.bento-grid', start: 'top 75%', once: true }
        }
      );

      // word-by-word bio reveal
      if (wordsRef.current) {
        const words = wordsRef.current.querySelectorAll('.word');
        gsap.fromTo(words, { y: 12, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.02, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: wordsRef.current, start: 'top 80%', once: true }
        });
      }
    }, secRef);

    // 3D Visual card rotation physics on hover
    const card = avatarCardRef.current;
    if (card) {
      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = (x / rect.width) - 0.5;
        const cy = (y / rect.height) - 0.5;

        gsap.to(card, {
          rotateY: cx * 18,
          rotateX: -cy * 18,
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out',
        });
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
      };

      const onMouseLeave = () => {
        gsap.to(card, {
          rotateY: -2,
          rotateX: 0,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      };

      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave);

      return () => {
        ctx.revert();
        card.removeEventListener('mousemove', onMouseMove);
        card.removeEventListener('mouseleave', onMouseLeave);
      };
    }

    // Refresh ScrollTrigger after lazy-loaded content mounts
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  const renderBioWords = () => {
    return DATA.bio.split(' ').map((w, i) => {
      const cleanWord = w.toLowerCase().replace(/[,.]/g, '');
      const isHighlighted = ['full-stack', 'developer', 'ai/ml', 'engineer', 'intelligent', 'systems', 'real-world', 'problems'].includes(cleanWord);
      return (
        <span
          key={i}
          className="word"
          style={{
            display: 'inline-block',
            marginRight: '0.3em',
            opacity: 0,
            color: isHighlighted ? 'var(--accent)' : 'var(--white)',
            fontFamily: isHighlighted ? 'var(--font-accent)' : 'inherit',
            fontStyle: isHighlighted ? 'italic' : 'inherit',
            textTransform: 'none',
          }}
        >
          {w}
        </span>
      );
    });
  };

  return (
    <section id="about" ref={secRef} style={{ overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5vw', width: '100%' }}>
        <p className="about-label section-label" style={{ opacity: 0, marginBottom: '1rem' }}>ABOUT</p>
        <h2 className="about-heading" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
          lineHeight: 0.9,
          marginBottom: '3.5rem',
          opacity: 0,
          letterSpacing: '-0.02em'
        }}>
          PERSONAL <span className="editorial-italic" style={{ color: 'var(--accent)' }}>Protocol</span>
        </h2>

        <div className="bento-grid">
          {/* Card 1: 3D Visual Card (4 Cols) */}
          <div className="bento-card" style={{ gridColumn: 'span 4', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
            <div
              ref={avatarCardRef}
              className="avatar-front glass"
              style={{
                position: 'relative',
                width: '100%',
                height: '270px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px dashed var(--border-accent)',
                transform: 'rotate(-2deg)',
                willChange: 'transform',
                perspective: '1000px',
                background: 'rgba(0,0,0,0.2)'
              }}
            >
              <img
                src="/avatar.png"
                alt={DATA.name}
                onLoad={(e) => e.target.style.opacity = 1}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center top',
                  display: 'block', filter: 'saturate(1.05) contrast(1.02)',
                  opacity: 0, transition: 'opacity 0.8s ease-out'
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), var(--glow) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>

          {/* Card 2: SVG Progress Dials (4 Cols) */}
          <div className="bento-card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem', minHeight: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <CircularProgress target={5} max={10} label="PROJECTS" suffix="+" />
              <CircularProgress target={7.4} max={10} label="CGPA" suffix="" />
            </div>
          </div>

          {/* Card 3: Terminal Details / Coordinates (4 Cols) */}
          <div className="bento-card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '280px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', color: 'var(--accent)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                // METADATA.LOG
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.4 }}>LOCATION:</span>
                <span style={{ color: 'var(--white)' }}>{DATA.location.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.4 }}>COORDINATES:</span>
                <span style={{ color: 'var(--white)' }}>22.3072° N, 73.1812° E</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>STATUS:</span>
                <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'inline-block',
                    flexShrink: 0,
                    animation: 'statusPulse 2s ease-in-out infinite',
                  }} />
                  ACTIVE_HIRE
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.4 }}>DEGREE:</span>
                <span style={{ color: 'var(--white)', textAlign: 'right' }}>CSE - B.TECH</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem' }}>
                <span style={{ opacity: 0.4 }}>EMAIL:</span>
                <a href={`mailto:${DATA.email}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  {DATA.email.substring(0, 14)}...
                </a>
              </div>
            </div>
          </div>

          {/* Card 4: Biography (12 Cols) */}
          <div className="bento-card" style={{ gridColumn: 'span 12', minHeight: '160px', display: 'flex', alignItems: 'center' }}>
            <p ref={wordsRef} style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              lineHeight: 1.9, opacity: 0.85
            }}>
              {renderBioWords()}
            </p>
          </div>
        </div>
      </div>
      <style>{`
        .bento-card {
          will-change: transform, box-shadow, border-color;
        }
        @media (max-width: 900px) {
          .bento-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 1.5rem !important;
          }
          .bento-card {
            grid-column: span 12 !important;
            min-height: auto !important;
            padding: 1.5rem !important;
          }
          .bento-card:nth-child(4) { order: -1; }
          .bento-card:nth-child(1) { order: 0; }
          .bento-card:nth-child(3) { order: 1; }
          .bento-card:nth-child(2) { order: 2; }
        }
      `}</style>
    </section>
  );
}
