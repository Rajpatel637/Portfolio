import React, { useEffect, useRef } from 'react';
import { 
  WebGLRenderer, Scene, PerspectiveCamera, 
  BufferGeometry, BufferAttribute, ShaderMaterial, Points,
  Timer
} from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DATA } from '../data';
import { prefersReducedMotion } from '../motion';
import Icon from './Icon';

gsap.registerPlugin(ScrollTrigger);

const isMobile = () => window.innerWidth < 768;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return 'BURNING THE MIDNIGHT OIL';
  if (h < 12) return 'GOOD MORNING - AVAILABLE FOR WORK';
  if (h < 18) return 'AVAILABLE FOR WORK';
  return 'EVENING MODE - STILL BUILDING';
}

/* ── GLSL Shaders ── */

// Vertex shader: computes Y oscillation + mouse repulsion entirely on the GPU
const vertexShader = /* glsl */ `
  // Per-particle original spawn position (never mutated)
  attribute vec3 aOrigin;

  // Elapsed seconds and normalized mouse coords (-1 to 1)
  uniform float uTime;
  uniform vec2  uMouse;

  void main() {
    // Start from the original spawn position
    vec3 pos = aOrigin;

    // ── Y-axis oscillation (matches: oy + sin(t*0.5 + ox*0.05) * 1.5) ──
    pos.y += sin(uTime * 0.5 + aOrigin.x * 0.05) * 1.5;

    // ── Mouse repulsion (2D, XY plane) ──
    // uMouse is in NDC (-1..1), scale to world-space range (* 30)
    vec2 mouseWorld = uMouse * 30.0;
    vec2 delta      = pos.xy - mouseWorld;
    float distSq    = dot(delta, delta);

    // Repel particles within radius 15 (15^2 = 225)
    if (distSq < 225.0) {
      float dist   = sqrt(distSq);
      float force  = (15.0 - dist) / 15.0 * 2.5;
      // Same factor as the CPU version: (force / dist) * 0.5
      float factor = (dist > 0.0001 ? force / dist : 0.0) * 0.5;
      pos.xy += delta * factor;
    }

    // Project to clip space (modelViewMatrix includes points.rotation)
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // Size attenuation: base size 0.8, same feel as PointsMaterial
    // The 300.0 divisor approximates Three's built-in attenuation
    gl_PointSize = 0.8 * (300.0 / -mvPos.z);
  }
`;

// Fragment shader: depth-coded particle color (white → lime tint at depth)
const fragmentShader = /* glsl */ `
  uniform vec3 uFarColor;
  void main() {
    vec2 c  = gl_PointCoord * 2.0 - 1.0;
    float d = dot(c, c);
    if (d > 1.0) discard;
    float alpha = 1.0 - smoothstep(0.4, 1.0, d);

    // Near particles = pure white, far particles = subtle theme tint
    float depth = clamp(gl_FragCoord.z * 1.8, 0.0, 1.0);
    vec3 nearColor = vec3(1.0, 1.0, 1.0);
    vec3 color = mix(nearColor, uFarColor, depth * 0.38);

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function Hero() {
  const canvasRef  = useRef(null);
  const contentRef = useRef(null);
  const nameRef    = useRef(null);
  const tagRef     = useRef(null);
  const cameraRef  = useRef(null);
  const secRef     = useRef(null);
  const scrollTextRef = useRef(null);

  /* ── Three.js GPU particle field ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 60;
    cameraRef.current = camera;

    // ── Generate particle positions in a sphere of radius 80 ──
    const count   = isMobile() ? 600 : 2500;
    const origins = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 80 * Math.cbrt(Math.random());
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      origins[i * 3]     = x;
      origins[i * 3 + 1] = y;
      origins[i * 3 + 2] = z;
    }

    const geo = new BufferGeometry();
    // position attribute is required by Three but the vertex shader
    // computes the actual position from aOrigin + uniforms each frame
    geo.setAttribute('position', new BufferAttribute(origins, 3));
    // aOrigin holds the immutable spawn positions the shader reads from
    geo.setAttribute('aOrigin',  new BufferAttribute(origins, 3));

    const mat = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:  { value: 0 },
        uMouse: { value: [0, 0] },
        uFarColor: { value: [0.776, 1.0, 0.0] },
      },
      transparent: true,
      depthWrite: false,              // soft additive feel for overlapping points
    });

    const points = new Points(geo, mat);
    scene.add(points);

    // ── Mouse tracking (NDC: -1 to 1) ──
    const mouse = { x: 0, y: 0 };
    const onMouseMove = e => {
      mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onThemeChange = e => {
      if (e.detail === 'volt') {
        mat.uniforms.uFarColor.value = [0.776, 1.0, 0.0];
      } else {
        mat.uniforms.uFarColor.value = [0.0, 0.933, 1.0];
      }
    };
    window.addEventListener('theme-change', onThemeChange);

    // ── Render loop: only updates uniforms, NO position buffer writes ──
    const timer = new Timer();
    let rafId;
    let isVisible = true;
    const animate = (timestamp) => {
      if (!isVisible) return; // Save battery when off-screen
      rafId = requestAnimationFrame(animate);
      timer.update(timestamp);

      // Push elapsed time and mouse coords to the shader
      mat.uniforms.uTime.value     = timer.getElapsed();
      mat.uniforms.uMouse.value[0] = mouse.x;
      mat.uniforms.uMouse.value[1] = mouse.y;

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    /* Intersection Observer to pause rendering */
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(animate);
      }
    }, { threshold: 0 });
    if (secRef.current) observer.observe(secRef.current);

    /* scroll parallax + warp-speed exit */
    const onScroll = () => {
      const prog = Math.min(window.scrollY / window.innerHeight, 1);
      // warp: camera rushes forward as user scrolls
      camera.position.z = 60 - prog * 50;
      points.rotation.y = prog * 1.2;

      // Update scroll indicator percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const pageProg = Math.min(window.scrollY / totalScroll, 1);
        if (scrollTextRef.current) {
          scrollTextRef.current.textContent = `${Math.round(pageProg * 100).toString().padStart(2, '0')}%`;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('theme-change', onThemeChange);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, []);

  /* ── GSAP: entrance + scroll exit on name chars ── */
  useEffect(() => {
    if (prefersReducedMotion()) {
      const chars = nameRef.current?.querySelectorAll('.char');
      if (chars?.length) gsap.set(chars, { opacity: 1, y: 0, x: 0, scale: 1, filter: 'none' });
      gsap.set('.hero-greeting, .hero-role, .hero-btns, .scroll-hint', { opacity: 1, y: 0 });
      if (tagRef.current) tagRef.current.textContent = DATA.tagline;
      return;
    }
    const tl = gsap.timeline({ delay: 0.8 });

    tl.fromTo('.hero-greeting', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });

    const chars = nameRef.current?.querySelectorAll('.char');
    if (chars?.length) {
      tl.fromTo(chars,
        { y: '120%', opacity: 0, rotateX: 15 },
        { y: '0%',  opacity: 1, rotateX: 0, stagger: 0.04, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );
    }

    tl.fromTo('.hero-role',  { y: 30, opacity: 0 }, { y: 0, opacity: 0.7, duration: 0.6 }, '-=0.4');
    tl.fromTo('.hero-btns',  { y: 20, opacity: 0 }, { y: 0, opacity: 1,   duration: 0.5 }, '-=0.3');
    tl.fromTo('.scroll-hint',{ opacity: 0 },         { opacity: 1,         duration: 0.5 });

    /* ── Scroll EXIT: chars disperse upward ── */
    if (chars?.length) {
      ScrollTrigger.create({
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: self => {
          const p = self.progress;
          chars.forEach((c, i) => {
            const spread = (i % 2 === 0 ? -1 : 1) * (20 + i * 8);
            gsap.set(c, {
              y:       `${-p * 150}%`,
              x:       spread * p,
              opacity: 1 - p * 2.5,
              rotateZ: spread * p * 0.3,
              scale:   1 + p * 4,
              filter:  `blur(${p * 20}px)`
            });
          });
          // fade out the rest of hero content — smooth eased
          const fadeOpacity = Math.max(0, 1 - p * 2.2);
          const easedFade   = Math.pow(fadeOpacity, 0.6); // soft curve
          gsap.set('.hero-greeting, .hero-role, .hero-btns, .scroll-hint', {
            opacity: easedFade,
            y: -p * 60,
          });
        },
      });
    }

    /* ── Typewriter with true blinking caret ── */
    const tag  = tagRef.current;
    let timer;
    if (tag) {
      const text = DATA.tagline;
      let i = 0;
      tag.textContent = '';
      timer = setInterval(() => {
        tag.textContent = text.slice(0, i + 1);
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          tag.innerHTML = text + '<span class="hero-caret" style="animation: heroBlink 1s step-end infinite">|</span>';
        }
      }, 60);
    }

    return () => {
      clearInterval(timer);
      ScrollTrigger.getAll().filter(t => t.vars?.trigger === '#home').forEach(t => t.kill());
    };
  }, []);

  const firstName = DATA.name.split(' ')[0];
  const lastName  = DATA.name.split(' ')[1];

  /* ── Character hover glitch ── */
  const GLITCH_CHARS = '!@#%&*<>[]{}=-+~^';
  const triggerCharGlitch = (e, original, isFirst) => {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget;
    let count = 0;
    const total = 9;
    // Reveal the element with solid color so glitch chars are visible
    el.style.WebkitTextFillColor = isFirst ? 'var(--white)' : 'var(--accent)';
    el.style.backgroundImage = 'none';
    el.style.WebkitBackgroundClip = 'unset';
    const iv = setInterval(() => {
      el.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      count++;
      if (count >= total) {
        clearInterval(iv);
        el.textContent = original;
        el.style.backgroundImage = isFirst
          ? 'linear-gradient(135deg, var(--white) 0%, rgba(255,255,255,0.7) 100%)'
          : 'linear-gradient(135deg, #e6ff56 0%, var(--accent) 100%)';
        el.style.WebkitBackgroundClip = 'text';
        el.style.WebkitTextFillColor = 'transparent';
        gsap.fromTo(el, { scale: 1.18 }, { scale: 1, duration: 0.28, ease: 'back.out(2.5)' });
      }
    }, 22);
  };

  const nameParts = [
    ...firstName.split('').map((c, i) => (
      <span key={`f${i}`} className="char"
        onMouseEnter={e => triggerCharGlitch(e, c, true)}
        style={{
          display: 'inline-block',
          willChange: 'transform, opacity',
          background: 'linear-gradient(135deg, var(--white) 0%, rgba(255,255,255,0.7) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          cursor: 'default',
        }}>
        {c}
      </span>
    )),
    <span key="space" className="char" style={{ display: 'inline-block', willChange: 'transform, opacity' }}>{' '}</span>,
    ...lastName.split('').map((c, i) => (
      <span key={`l${i}`} className="char"
        onMouseEnter={e => triggerCharGlitch(e, c, false)}
        style={{
          display: 'inline-block',
          willChange: 'transform, opacity',
          background: 'linear-gradient(135deg, #e6ff56 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 30px rgba(198,255,0,0.25))',
          cursor: 'default',
        }}>
        {c}
      </span>
    )),
  ];

  return (
    <section id="home" ref={secRef} style={{
      padding: 0, height: '100svh', // mobile dynamic viewport height fix
      position: 'relative', overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, willChange: 'transform' }} />

      <div ref={contentRef} className="hero-content" style={{
        position: 'absolute', zIndex: 10,
        bottom: '18%', left: '6vw', maxWidth: '90vw',
      }}>
        <p className="hero-greeting" style={{
          fontFamily: 'var(--font-body)', fontSize: '0.75rem',
          color: 'var(--accent)', letterSpacing: '0.2em',
          marginBottom: '1.2rem', opacity: 0,
        }}>
          {getGreeting()}
        </p>

        {/* Name — overflow visible so chars can fly out */}
        <h1 ref={nameRef} aria-label={DATA.name} className="hero-name" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(4rem, 13vw, 12rem)',
          lineHeight: 0.9, letterSpacing: '-0.02em',
          marginBottom: '0.8rem',
          display: 'flex', flexWrap: 'wrap',
        }}>
          {nameParts}
        </h1>

        <p className="hero-role" style={{
          fontFamily: 'var(--font-accent)', fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 2.2vw, 1.8rem)',
          color: 'var(--white)', opacity: 0, marginBottom: '0.6rem',
        }}>
          {DATA.role}
        </p>

        <p ref={tagRef} style={{
          fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          color: 'var(--accent)', marginBottom: '2rem', minHeight: '1.5rem',
        }} />

        <div className="hero-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0 }}>
          <a href="#work" className="btn-primary"
            onClick={e => {
              e.preventDefault();
              const el = document.getElementById('work');
              if (el) window.__lenis ? window.__lenis.scrollTo(el, { duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' });
            }}>
            <Icon name="external" size={15} />
            VIEW MY WORK
          </a>
          <a href={DATA.cv || `mailto:${DATA.email}`} className="btn-outline"
            download={DATA.cv ? 'Raj_Patel_CV.pdf' : undefined}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon name={DATA.cv ? 'download' : 'mail'} size={15} />
              {DATA.cv ? 'DOWNLOAD CV' : 'EMAIL ME'}
            </span>
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint" style={{
        position: 'absolute', bottom: '3rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
        opacity: 0, zIndex: 10,
      }}>
        <span ref={scrollTextRef} style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--accent)' }}>00%</span>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(240,240,240,0.4)' }}>SCROLL</span>
        <div style={{ width: '1px', height: '60px', background: 'rgba(255,255,255,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', width: '4px', height: '4px', borderRadius: '50%',
            background: 'linear-gradient(90deg, var(--accent), var(--accent-alt))', left: '-1.5px', top: 0,
            animation: 'scrollDot 1.5s ease-in-out infinite',
          }} />
        </div>
        <style>{`
          @media (max-width: 640px) {
            .hero-content {
              left: 5vw !important;
              right: 5vw !important;
              bottom: 12% !important;
              max-width: none !important;
            }
            .hero-name {
              font-size: clamp(3.4rem, 18vw, 6rem) !important;
              line-height: 0.88 !important;
            }
            .hero-btns {
              flex-direction: column;
              align-items: flex-start;
            }
            .hero-btns .btn-primary,
            .hero-btns .btn-outline {
              width: min(100%, 260px);
              justify-content: center;
              min-height: 44px;
            }
            .scroll-hint {
              bottom: 1.5rem !important;
            }
            .scroll-hint span {
              font-size: 0.85rem !important;
            }
          }
          @keyframes scrollDot { 0%{top:0;opacity:1} 100%{top:100%;opacity:0} }
          @keyframes heroBlink { 50% { opacity: 0; } }
          .hero-caret { color: var(--white); font-weight: 300; }
        `}</style>
      </div>
    </section>
  );
}
