import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DATA } from '../data';
import { prefersReducedMotion } from '../motion';
import Icon from './Icon';

gsap.registerPlugin(ScrollTrigger);

const extraDetails = [
  {
    highlights: [
      'Focused coursework in DSA, Operating Systems, DBMS, Machine Learning, and System Design.',
      'Active developer contributions inside university technical labs and computing hackathons.',
      'Acquired fundamentals of production engineering, caching networks, and algorithm efficiency.'
    ],
    tech: ['DSA', 'Operating Systems', 'DBMS', 'Machine Learning', 'System Design']
  },
  {
    highlights: [
      'Engineered stateful agent workflows using LangGraph and LangChain for multi-agent orchestration.',
      'Built scalable document pipelines using pgvector for high-dimensional semantic search.',
      'Integrated LLM endpoints (Groq, Gemini, Llama) with fallback rules and async batch embeddings.'
    ],
    tech: ['LangGraph', 'LangChain', 'FastAPI', 'pgvector', 'Redis', 'Gemini', 'Groq']
  },
  {
    highlights: [
      'Developed real-time communications layer utilizing WebSockets and Node.js APIs.',
      'Configured containerized services with Docker and docker-compose for local and staging environments.',
      'Optimized query speeds in PostgreSQL and managed document models in MongoDB clusters.'
    ],
    tech: ['React.js', 'Node.js', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker']
  }
];

function useTextScramble(text, active, speed = 25) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }
    let iteration = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@#$*&%-+=';
    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      iteration += 1 / 2.5;
      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, active, speed]);

  return display;
}

function ScrambleText({ text }) {
  const display = useTextScramble(text, true);
  return <span>{display}</span>;
}

function ExperienceCard({ exp, index }) {
  const [expanded, setExpanded] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!drawerRef.current) return;
    if (expanded) {
      gsap.fromTo(drawerRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    } else {
      gsap.to(drawerRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }, [expanded]);

  const details = extraDetails[index] || { highlights: [], tech: [] };

  return (
    <div className="glass exp-card" style={{
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.05)',
      transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s, border-color 0.35s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
          {exp.period}
        </div>
        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
          [LOG_EXP0{index + 1}]
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '1.45rem',
        letterSpacing: '0.02em', marginBottom: '0.3rem', color: 'var(--white)'
      }}>{exp.company}</div>
      <div style={{ fontSize: '0.85rem', fontStyle: 'italic', opacity: 0.6, marginBottom: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-accent)' }}>
        {exp.role}
      </div>
      <p style={{ fontSize: '0.82rem', lineHeight: 1.7, opacity: 0.65, marginBottom: '1rem' }}>{exp.desc}</p>
      
      {/* Drawer Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="btn-outline"
        style={{
          fontSize: '0.65rem',
          padding: '0.4rem 0.85rem',
          borderRadius: '4px',
          width: 'max-content'
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Icon name="code" size={12} />
          {expanded ? 'COLLAPSE SYSTEMS' : 'INSPECT SYSTEMS'}
        </span>
      </button>

      {/* Accordion content */}
      <div
        ref={drawerRef}
        style={{
          height: 0,
          opacity: 0,
          overflow: 'hidden',
          borderTop: expanded ? '1px dashed rgba(255,255,255,0.08)' : 'none',
          marginTop: expanded ? '1rem' : 0,
          paddingTop: expanded ? '1rem' : 0
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
            // ENCRYPTED_VERIFICATION_LOGS
          </span>
          {expanded && details.highlights.map((hl, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.78rem', lineHeight: 1.6, opacity: 0.8 }}>
              <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>&gt;</span>
              <ScrambleText text={hl} />
            </div>
          ))}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
            {details.tech.map(t => (
              <span key={t} style={{
                fontSize: '0.6rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.15rem 0.45rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px',
                color: 'var(--white)',
                opacity: 0.8
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const spineRef = useRef(null);
  const secRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set('.exp-label, .journey-char, .exp-entry, .spine-dot', {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
      });
      if (spineRef.current) gsap.set(spineRef.current, { height: '100%' });
      return;
    }
    const ctx = gsap.context(() => {
      // Section label slide-in
      gsap.fromTo('.exp-label', { x: -40, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.7,
        scrollTrigger: { trigger: secRef.current, start: 'top 80%', once: true }
      });

      // Animate spine height
      gsap.fromTo(spineRef.current, { height: '0%' }, {
        height: '100%', ease: 'none',
        scrollTrigger: {
          trigger: secRef.current,
          start: 'top 70%', end: 'bottom 70%', scrub: true
        }
      });

      // Heading chars scatter-in
      const headingChars = secRef.current?.querySelectorAll('.journey-char');
      if (headingChars?.length) {
        gsap.fromTo(headingChars,
          {
            x: () => gsap.utils.random(-150, 150),
            y: () => gsap.utils.random(-150, 150),
            opacity: 0,
            rotate: () => gsap.utils.random(-40, 40),
          },
          {
            x: 0, y: 0, opacity: 1, rotate: 0,
            stagger: 0.05, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: secRef.current, start: 'top 80%', once: true }
          }
        );
      }

      // Entry cards + dots
      const entries = secRef.current?.querySelectorAll('.exp-entry');
      entries?.forEach((el, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(el, { x: isLeft ? -60 : 60, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%', once: true }
        });
        const dot = el.querySelector('.spine-dot-wrapper');
        if (dot) {
          gsap.fromTo(dot, { scale: 0 }, {
            scale: 1, duration: 0.4, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: el, start: 'top 75%', once: true }
          });
        }
      });
    }, secRef);

    // Refresh ScrollTrigger after lazy-loaded content mounts
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={secRef} style={{ padding: '100px 0', position: 'relative' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 5vw' }}>
        <p className="section-label exp-label" style={{ opacity: 0, marginBottom: '1rem' }}>{DATA.timelineLabel || 'EXPERIENCE'}</p>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          lineHeight: 0.9, marginBottom: '5rem', letterSpacing: '-0.01em'
        }}>
          {(DATA.timelineHeading || 'THE JOURNEY').split('').map((c, i) => (
            <span key={i} className="journey-char" style={{ display: 'inline-block' }}>
              {c === ' ' ? '\u00A0' : c}
            </span>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          {/* Spine with Linear Glow Gradient */}
          <div className="timeline-spine" style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0,
            width: '2px', background: 'rgba(255,255,255,0.06)',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 10px rgba(255,255,255,0.02)'
          }}>
            <div ref={spineRef} style={{
              width: '100%', height: '0%',
              background: 'linear-gradient(to bottom, var(--accent), var(--accent-alt))', position: 'absolute', top: 0,
              boxShadow: '0 0 12px var(--glow)'
            }} />
          </div>

          {DATA.experience.map((exp, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={i} className="exp-entry timeline-grid" style={{
                display: 'grid', gridTemplateColumns: '1fr 40px 1fr',
                gap: '2rem',
                marginBottom: '4rem',
                alignItems: 'center',
              }}>
                {/* Left content */}
                <div style={{ gridColumn: isLeft ? '1' : '3' }}>
                  <ExperienceCard exp={exp} index={i} />
                </div>

                {/* Spine dot with radar pulse halo */}
                <div style={{
                  gridColumn: '2', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <div className="spine-dot-wrapper" style={{ position: 'relative', width: '14px', height: '14px', transform: 'scale(0)', zIndex: 10 }}>
                    <div className="spine-dot" style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: 'var(--accent)',
                      boxShadow: '0 0 12px var(--glow)',
                      zIndex: 3,
                    }} />
                    <div className="pulse-ring" style={{
                      position: 'absolute', inset: '-6px', borderRadius: '50%',
                      border: '2px solid var(--accent)',
                      opacity: 0.8,
                      animation: 'radarPulse 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }} />
                  </div>
                </div>

                {/* Empty cell on opposite side */}
                <div style={{ gridColumn: isLeft ? '3' : '1' }} />
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes radarPulse {
          0% { transform: scale(0.5); opacity: 0.8; }
          50% { opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @media (max-width: 768px) {
          .exp-entry { grid-template-columns: 24px 1fr !important; gap: 1rem !important; }
          .exp-entry > div:nth-child(3) { display: none !important; }
          .exp-entry > div:nth-child(1) { grid-column: 2 !important; }
          .exp-entry > div:nth-child(2) { grid-column: 1 !important; }
          .timeline-spine { left: 12px !important; }
        }
        .exp-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 12px 48px var(--glow) !important;
          border-color: var(--border-accent) !important;
        }
      `}</style>
    </section>
  );
}
