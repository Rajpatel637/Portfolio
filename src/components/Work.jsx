import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DATA } from '../data';
import { prefersReducedMotion } from '../motion';
import Icon from './Icon';

gsap.registerPlugin(ScrollTrigger);

const isTouch = () => 'ontouchstart' in window;

function ProjectPreviewMockup({ num, color }) {
  if (num === '01') {
    // NexusAI: Scrolling agent command lines
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.7)', padding: '0.65rem' }}>
        <div style={{ color, fontWeight: 'bold' }}>&gt; AGENT_EXECUTE: nexus_core</div>
        <div style={{ opacity: 0.45 }}>&gt; [research] scanning repository... OK</div>
        <div style={{ opacity: 0.65 }}>&gt; [codegen] generating endpoints... 98%</div>
        <div style={{ opacity: 0.85 }}>&gt; [agent] running tests: 42 passed</div>
        <div style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 1s infinite' }} />
          DEPLOYS_PRODUCTION_STABLE
        </div>
      </div>
    );
  }
  if (num === '02') {
    // RAG Document Intelligence: Vector match graph
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', opacity: 0.5 }}>
          <span>INDEX: HNSW_M16</span>
          <span style={{ color, fontWeight: 'bold' }}>SIM: 0.892</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '55px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
          {[35, 60, 45, 90, 50, 75, 40].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 3 ? color : 'rgba(255,255,255,0.12)', borderRadius: '2px', position: 'relative', filter: i === 3 ? `drop-shadow(0 0 5px ${color})` : 'none' }} />
          ))}
        </div>
        <div style={{ fontSize: '0.52rem', opacity: 0.4, textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>VECTOR_SPACE_RECALL_MATRIX</div>
      </div>
    );
  }
  if (num === '03') {
    // AI Resume & Job Matcher: Match percentages
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.65rem', height: '100%', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', opacity: 0.6 }}>MATCH_ACCURACY</span>
          <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-display)', color, letterSpacing: '0.05em' }}>94.2%</span>
        </div>
        <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '94.2%', background: color, boxShadow: `0 0 6px ${color}` }} />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
          {['Python', 'NLP', 'TF-IDF', 'FastAPI'].map(skill => (
            <span key={skill} style={{ fontSize: '0.52rem', padding: '0.1rem 0.35rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', opacity: 0.6 }}>{skill}</span>
          ))}
        </div>
      </div>
    );
  }
  if (num === '04') {
    // Movieplex: Cinematic card grid
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', padding: '0.65rem', height: '100%' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            background: i === 0 ? `linear-gradient(to top, rgba(0,0,0,0.85), transparent), url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&auto=format&fit=crop&q=60') center/cover` : 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '4px',
            height: '75px',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0.25rem',
            overflow: 'hidden'
          }}>
            <div style={{ width: '100%', height: '3px', background: i === 0 ? color : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
          </div>
        ))}
      </div>
    );
  }
  // Default/UniEats: Delivery route graph
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', padding: '0.65rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width="100%" height="70" viewBox="0 0 100 40">
        <path d="M10 25 Q 30 5, 50 30 T 90 15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M10 25 Q 30 5, 50 30 T 90 15" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="100" strokeDashoffset="0" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        <circle cx="10" cy="25" r="2.5" fill={color} />
        <circle cx="50" cy="30" r="2" fill="var(--white)" />
        <circle cx="90" cy="15" r="3" fill={color} />
      </svg>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const viewLink = project.live || project.github;
  const codeLink = project.github;

  useEffect(() => {
    if (isTouch()) return;
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    let cachedRect = null;

    const onEnter = () => {
      cachedRect = card.getBoundingClientRect();
    };

    const onMove = e => {
      if (!cachedRect) cachedRect = card.getBoundingClientRect();
      const x = e.clientX - cachedRect.left;
      const y = e.clientY - cachedRect.top;
      const cx = x / cachedRect.width - 0.5;
      const cy = y / cachedRect.height - 0.5;
      
      gsap.to(card, {
        rotateY: cx * 14,
        rotateX: -cy * 14,
        y: -12,
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out'
      });
      gsap.to(glow, { x: x - 100, y: y - 100, duration: 0.2 });
    };

    const onLeave = () => {
      cachedRect = null;
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out'
      });
    };

    card.addEventListener('mouseenter', onEnter, { passive: true });
    card.addEventListener('mousemove', onMove, { passive: true });
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className="project-card glass" style={{
      minWidth: 'clamp(300px, 28vw, 360px)',
      width: 'clamp(300px, 28vw, 360px)',
      minHeight: '460px',
      height: 'auto',
      flexShrink: 0, position: 'relative', overflow: 'hidden',
      borderRadius: '16px', padding: '2rem',
      display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 0.4s, border-color 0.4s',
      transformStyle: 'preserve-3d',
      willChange: 'transform',
      '--card-color': project.color,
    }}>
      {/* Dynamic Glow */}
      <div ref={glowRef} className="card-glow" style={{
        position: 'absolute', top: 0, left: 0, width: '200px', height: '200px',
        background: `radial-gradient(circle, ${project.color} 0%, transparent 70%)`,
        opacity: 0, pointerEvents: 'none', zIndex: 0, filter: 'blur(20px)',
        mixBlendMode: 'screen', transition: 'opacity 0.4s',
      }} />

      {/* accent strip */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
        background: project.color,
        transition: 'width 0.3s',
        zIndex: 1,
      }} className="accent-strip" />
      {/* watermark number */}
      <div style={{
        position: 'absolute', right: '1.5rem', top: '1rem',
        fontFamily: 'var(--font-display)', fontSize: '5rem',
        color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none',
        zIndex: 1,
      }}>{project.num}</div>

      {/* Domain Mockup Container */}
      <div className="project-preview" aria-hidden="true" style={{
        position: 'relative',
        minHeight: '140px',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        background: `linear-gradient(135deg, color-mix(in srgb, ${project.color} 18%, transparent), rgba(255,255,255,0.025))`,
        overflow: 'hidden',
        zIndex: 1,
        transition: 'border-color 0.4s'
      }}>
        <ProjectPreviewMockup num={project.num} color={project.color} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto', position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.8rem',
          color: 'var(--white)', letterSpacing: '0.02em', lineHeight: 1.1
        }}>{project.name}</h3>
        <div style={{
          fontSize: '0.72rem',
          color: 'var(--accent)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.85,
        }}>
          {project.period || project.status || project.title}
        </div>
        {project.title && (
          <div style={{ fontSize: '0.78rem', opacity: 0.55, lineHeight: 1.5 }}>
            {project.title}
          </div>
        )}
        <p style={{ fontSize: '0.82rem', lineHeight: 1.7, opacity: 0.6, flex: 1 }}>{project.desc}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {project.stack.map(s => (
            <span key={s} style={{
              fontSize: '0.65rem', padding: '0.2rem 0.6rem',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '999px', letterSpacing: '0.05em'
            }}>{s}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          {viewLink && (
            <a href={viewLink} target="_blank" rel="noopener noreferrer"
              className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.6rem 1.2rem', flex: 1, justifyContent: 'center' }}>
              <Icon name="external" size={14} />
              {project.live ? 'LIVE' : 'VIEW'}
            </a>
          )}
          {codeLink && (
            <a href={codeLink} target="_blank" rel="noopener noreferrer"
              className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.6rem 1.2rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Icon name="code" size={14} />
                CODE
              </span>
            </a>
          )}
          {!viewLink && !codeLink && (
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', opacity: 0.7 }}>
              {project.status || 'Coming soon'}
            </span>
          )}
        </div>
      </div>
      <style>{`
        .project-card:hover {
          box-shadow: 0 20px 60px color-mix(in srgb, var(--card-color) 30%, transparent) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }
        .project-card:hover .accent-strip { width: 8px !important; }
        .accent-strip { overflow: hidden; }
        .accent-strip::after {
          content: ''; position: absolute; top: -100%; left: 0; right: 0; height: 60%;
          background: rgba(255,255,255,0.4); animation: none;
        }
        .project-card:hover .accent-strip::after { animation: stripShimmer 0.7s ease-out; }
        .project-card:hover .project-preview { border-color: color-mix(in srgb, var(--card-color) 45%, transparent) !important; }
        .project-card:hover .card-glow { opacity: 0.25 !important; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}

export default function Work() {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const progressBarRef = useRef(null);
  const indexTextRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set('.work-label, .work-char, .project-card, .work-nav-progress', { opacity: 1, y: 0, filter: 'none' });
      return;
    }
    const isMob = window.innerWidth < 768;
    const track   = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    let pinTween;
    if (!isMob) {
      let lastProgress = 0;
      const getTotalScroll = () => track.scrollWidth - window.innerWidth + 120;
      pinTween = gsap.to(track, {
        x: () => -getTotalScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: 'top top',
          end: () => `+=${getTotalScroll() + 200}`,
          scrub: 1,
          invalidateOnRefresh: true,
          id: 'work-pin',
          onUpdate: self => {
            const prog = self.progress;
            const velocity = (prog - lastProgress) * 100;
            lastProgress = prog;
            gsap.to(track, { skewX: velocity * -0.8, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });


            // 1. Update bottom progress bar
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${prog * 100}%`;
            }

            // 2. Update active card index numbers
            const cardCount = DATA.projects.length;
            const activeIndex = Math.min(Math.floor(prog * cardCount), cardCount - 1);
            if (indexTextRef.current) {
              indexTextRef.current.textContent = `0${activeIndex + 1} / 0${cardCount}`;
            }

            // 3. Immersive background accent shift
            const activeColor = DATA.projects[activeIndex].color;
            document.documentElement.style.setProperty(
              '--ambient-glow',
              `color-mix(in srgb, ${activeColor} 8%, transparent)`
            );
          },
          onToggle: self => {
            if (!self.isActive) {
              document.documentElement.style.removeProperty('--ambient-glow');
            }
          }
        }
      });
    }

    // Heading chars
    const headingChars = section.querySelectorAll('.work-char');
    const charTween = gsap.fromTo(headingChars, { y: '100%', opacity: 0 }, {
      y: '0%', opacity: 1, stagger: 0.03, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: '.work-heading-wrap', start: 'top 85%', id: 'work-chars' }
    });

    // Section label
    const labelTween = gsap.fromTo('.work-label', { x: -40, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.7,
      scrollTrigger: { trigger: '.work-heading-wrap', start: 'top 85%', id: 'work-label' }
    });

    // Project cards stagger in with blur reveal
    const cardTween = gsap.fromTo('.project-card', 
      { y: 60, opacity: 0, filter: 'blur(12px)' }, 
      {
        y: 0, opacity: 1, filter: 'blur(0px)', 
        stagger: 0.12, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: isMob ? section : '.work-heading-wrap', start: 'top 75%', id: 'work-cards' }
      }
    );

    // Fade in progress bar
    const navTween = gsap.fromTo('.work-nav-progress',
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.6, delay: 0.4,
        scrollTrigger: { trigger: '.work-heading-wrap', start: 'top 75%' }
      }
    );

    // Refresh ScrollTrigger after lazy-loaded content mounts
    ScrollTrigger.refresh();

    // ── Cleanup: kill all ScrollTriggers and tweens ──────────
    return () => {
      if (pinTween) {
        pinTween.scrollTrigger?.kill();
        pinTween.kill();
      }
      charTween.scrollTrigger?.kill();
      labelTween.scrollTrigger?.kill();
      cardTween.scrollTrigger?.kill();
      navTween.scrollTrigger?.kill();
      charTween.kill();
      labelTween.kill();
      cardTween.kill();
      navTween.kill();
      // Restore track position and background variables
      gsap.set(track, { x: 0, clearProps: 'x' });
      document.documentElement.style.removeProperty('--ambient-glow');
    };
  }, []);

  const headingText = 'SELECTED WORK';

  return (
    <section id="work" ref={sectionRef} style={{ padding: '120px 0', overflow: 'hidden' }}>
      <div className="work-heading-wrap" style={{ padding: '0 6vw', marginBottom: '4rem' }}>
        <p className="section-label work-label" style={{ opacity: 0 }}>PROJECTS</p>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 9vw, 8rem)',
          lineHeight: 0.9, overflow: 'hidden', letterSpacing: '-0.01em'
        }}>
          {headingText.split('').map((c, i) => (
            <span key={i} className="work-char" style={{ display: 'inline-block', overflow: 'hidden' }}>
              {c === ' ' ? '\u00A0' : c}
            </span>
          ))}
        </div>
        <div style={{ width: '100%', height: '1px', background: 'var(--accent)', marginTop: '1rem', opacity: 0.3 }} />
      </div>

      <div ref={trackRef} style={{
        display: 'flex', gap: '2rem',
        paddingLeft: '6vw', paddingRight: '6vw',
        width: 'max-content',
      }}>
        {DATA.projects.map((p, i) => <ProjectCard key={p.num} project={p} index={i} />)}
      </div>
      
      {/* Mobile Swipe Hint */}
      <div className="mobile-swipe-hint" style={{
        display: 'none',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
        marginTop: '1rem',
        letterSpacing: '0.1em'
      }}>
        &larr; SWIPE TO EXPLORE &rarr;
      </div>

      {/* Bottom Navigation & Progress tracker */}
      <div className="work-nav-progress" style={{
        maxWidth: '1100px',
        margin: '3.5rem auto 0 auto',
        padding: '0 6vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2.5rem',
        opacity: 0,
      }}>
        <div ref={indexTextRef} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: 'var(--accent)',
          letterSpacing: '0.1em',
          minWidth: '70px'
        }}>
          01 / {DATA.projects.length.toString().padStart(2, '0')}
        </div>
        <div style={{
          flex: 1,
          height: '2px',
          background: 'rgba(255,255,255,0.06)',
          position: 'relative',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div ref={progressBarRef} style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '0%',
            background: 'var(--accent)',
            boxShadow: '0 0 8px var(--glow)',
            transition: 'width 0.1s ease-out'
          }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          #work { overflow: hidden !important; }
          #work > div:nth-child(2) { 
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            padding-bottom: 2rem !important;
            -webkit-overflow-scrolling: touch;
          }
          #work .project-card {
            scroll-snap-align: center;
            width: 85vw !important;
            min-width: 85vw !important;
            min-height: 420px !important;
            padding: 1.4rem !important;
          }
          #work .project-preview {
            min-height: 120px !important;
          }
          #work .btn-primary,
          #work .btn-outline {
            min-height: 42px;
          }
          .work-nav-progress {
            display: none !important;
          }
          .mobile-swipe-hint {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
