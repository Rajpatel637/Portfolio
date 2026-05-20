import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../motion';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('volt');
  const linksRef = useRef([]);

  const toggleTheme = () => {
    const next = theme === 'volt' ? 'cobalt' : 'volt';
    setTheme(next);
    const root = document.documentElement;
    root.style.setProperty('--bg', next === 'volt' ? '#050508' : '#020813');
    root.style.setProperty('--accent', next === 'volt' ? '#c6ff00' : '#00eeff');
    root.style.setProperty('--accent-alt', next === 'volt' ? '#00eeff' : '#7b61ff');
    root.style.setProperty('--glow', next === 'volt' ? 'rgba(198, 255, 0, 0.15)' : 'rgba(0, 238, 255, 0.15)');
    root.style.setProperty('--glow-alt', next === 'volt' ? 'rgba(0, 238, 255, 0.15)' : 'rgba(123, 97, 255, 0.15)');
    root.style.setProperty('--border-accent', next === 'volt' ? 'rgba(198, 255, 0, 0.3)' : 'rgba(0, 238, 255, 0.3)');
    root.style.setProperty('--theme-id', next);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: next }));
  };

  /* Active section tracking */
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.35 }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* Scroll-based nav style */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Magnetic effect — each link and logo floats toward cursor via optimized delegation */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let activeNavEl = null;
    let rect = null;

    const onMouseMove = e => {
      if (!activeNavEl || !rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      
      gsap.to(activeNavEl, {
        x: dx * 0.3,
        y: dy * 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const onMouseOver = e => {
      const el = e.target.closest('.nav-links a, .nav-logo');
      if (el) {
        activeNavEl = el;
        rect = el.getBoundingClientRect();
      }
    };

    const onMouseOut = e => {
      const el = e.target.closest('.nav-links a, .nav-logo');
      if (el && el === activeNavEl) {
        gsap.to(activeNavEl, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        activeNavEl = null;
        rect = null;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  /* Navbar entrance on load */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo('.nav-item',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, delay: 0.6, ease: 'power3.out' }
    );
  }, []);

  const links = ['Home', 'About', 'Work', 'Skills', 'Experience', 'Contact'];

  const scrollTo = useCallback(id => {
    const el = document.getElementById(id.toLowerCase());
    if (!el) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  }, []);

  /* Stagger mobile menu links on open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen && !prefersReducedMotion()) {
      gsap.fromTo('.mobile-menu a',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.25 }
      );
    }

    // Focus trap for mobile menu
    if (!menuOpen) return () => { document.body.style.overflow = ''; };
    const menu = document.querySelector('.mobile-menu');
    if (!menu) return () => { document.body.style.overflow = ''; };
    const focusable = menu.querySelectorAll('a, button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); return; }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    first?.focus();
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKeyDown); };
  }, [menuOpen]);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          background: scrolled ? 'rgba(5,5,8,0.85)' : 'rgba(5,5,8,0)',
          borderBottomColor: scrolled ? 'rgba(255,255,255,0.06)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'background 0.4s ease, border-bottom-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        <div className="nav-logo nav-item">RP</div>

        <ul className="nav-links">
          {links.map((l, i) => (
            <li key={l} className="nav-item" style={{ listStyle: 'none' }}>
              <a
                ref={el => linksRef.current[i] = el}
                href={`#${l.toLowerCase()}`}
                className={active === l.toLowerCase() ? 'active' : ''}
                onClick={e => { e.preventDefault(); scrollTo(l); }}
                style={{ display: 'inline-block' }}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }} className="nav-item">
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              color: 'var(--white)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              padding: '0.35rem 0.6rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'background 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <span style={{ color: 'var(--text-muted)' }}>THEME:</span>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{theme === 'volt' ? 'V' : 'C'}</span>
          </button>

          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`}
            onClick={e => { e.preventDefault(); scrollTo(l); }}>
            {l}
          </a>
        ))}
      </div>
    </>
  );
}
