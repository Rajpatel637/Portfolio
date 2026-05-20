import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DATA } from '../data';
import { prefersReducedMotion } from '../motion';
import Icon from './Icon';

gsap.registerPlugin(ScrollTrigger);

const codeSnippets = {
  ai: `# langgraph_agent.py
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("action", call_tool)

workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("action", "agent")

app = workflow.compile()`,

  frontend: `// MotionCanvas.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function MotionCanvas() {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.to(boxRef.current, {
      rotate: 360,
      scale: 1.1,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
  }, []);

  return <div ref={boxRef} className="orb" />;
}`,

  backend: `# search_api.py
from fastapi import FastAPI
from pgvector.sqlalchemy import to_dbval
from sqlalchemy import select

app = FastAPI()

@app.get("/search")
async def vector_search(query_vector: list[float]):
    async with db.session() as session:
        items = await session.execute(
            select(Document)
            .order_by(Document.embedding.cosine_distance(query_vector))
            .limit(5)
        )
        return items.scalars().all()`,

  devops: `# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]`
};

const categories = [
  {
    id: 'ai',
    tag: '01 // AI_AGENTIC',
    title: 'AI & AGENTIC ARCHITECTURES',
    skills: [
      { name: 'Python / AI-ML', level: 90 },
      { name: 'LangGraph / LangChain', level: 82 }
    ]
  },
  {
    id: 'frontend',
    tag: '02 // FRONT_CREATIVE',
    title: 'FRONTEND & MOTION UI',
    skills: [
      { name: 'React / Next.js', level: 88 },
      { name: 'TypeScript / JavaScript', level: 85 },
      { name: 'Three.js / Motion UI', level: 74 }
    ]
  },
  {
    id: 'backend',
    tag: '03 // BACKEND_DATA',
    title: 'BACKEND & DATA SYSTEMS',
    skills: [
      { name: 'FastAPI / Node.js', level: 86 },
      { name: 'PostgreSQL / pgvector', level: 84 }
    ]
  },
  {
    id: 'devops',
    tag: '04 // INFRA_DEVOPS',
    title: 'DEVOPS & DEPLOYMENT',
    skills: [
      { name: 'Docker / DevOps', level: 78 }
    ]
  }
];

function SkillSphere({ items }) {
  const containerRef = useRef(null);
  const reduceMotion = prefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const el = containerRef.current;
    if (!el) return;

    let rotationX = 0;
    let rotationY = 0;
    let targetX = 0;
    let targetY = 0;
    let raf;
    let isVisible = true;
    let autoRotationX = 0;
    let autoRotationY = 0;

    const animate = () => {
      if (!isVisible) return;
      
      const time = Date.now() * 0.001;
      
      autoRotationX -= 0.005; 
      autoRotationY += 0.005;

      rotationX += (targetY - rotationX) * 0.05;
      rotationY += (targetX - rotationY) * 0.05;
      
      const finalX = autoRotationX + rotationX;
      const finalY = autoRotationY + rotationY;

      const floatY = Math.sin(time * 0.8) * 15;
      const pulseScale = 1 + Math.sin(time * 0.5) * 0.03;
      
      gsap.set(el, { 
        y: floatY, 
        scale: pulseScale,
        force3D: true 
      });

      const texts = el.querySelectorAll('.sphere-item');
      const radius = window.innerWidth < 480 ? 110 : window.innerWidth < 768 ? 140 : 230;
      const total = texts.length;
      const goldenRatio = (1 + Math.sqrt(5)) / 2;

      texts.forEach((text, i) => {
        const theta = 2 * Math.PI * i / goldenRatio;
        const phi = Math.acos(1 - 2 * (i + 0.5) / total);

        let x = Math.cos(theta) * Math.sin(phi);
        let y = Math.sin(theta) * Math.sin(phi);
        let z = Math.cos(phi);

        let tempY = y * Math.cos(finalX) - z * Math.sin(finalX);
        let tempZ = y * Math.sin(finalX) + z * Math.cos(finalX);
        y = tempY; z = tempZ;

        let tempX = x * Math.cos(finalY) + z * Math.sin(finalY);
        tempZ = -x * Math.sin(finalY) + z * Math.cos(finalY);
        x = tempX; z = tempZ;

        const scale = (z + 2) / 3;
        const alpha = (z + 1.5) / 2.5;

        gsap.set(text, {
          x: x * radius,
          y: y * radius,
          scale: scale,
          opacity: alpha,
          zIndex: Math.round(z * 100)
        });
      });

      raf = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) raf = requestAnimationFrame(animate);
      else cancelAnimationFrame(raf);
    }, { threshold: 0.05 });

    observer.observe(el);
    animate();

    const onMove = (e) => {
      if (!isVisible) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = (e.clientY - cy) * 0.002;
      targetY = (e.clientX - cx) * 0.002;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (reduceMotion) {
    return (
      <div className="skill-chip-grid">
        {items.slice(0, 18).map((item, i) => (
          <span key={`${item}-${i}`} className="skill-chip">{item}</span>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{
      position: 'relative', width: '100%', height: 'clamp(320px, 50vw, 460px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        position: 'absolute', width: '250px', height: '250px',
        background: 'var(--accent)', filter: 'blur(120px)', opacity: 0.15,
        borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
        animation: 'pulseGlow 4s ease-in-out infinite alternate'
      }} />
      <div style={{
        position: 'absolute', width: '300px', height: '300px',
        background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
        filter: 'blur(80px)', opacity: 0, borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
        animation: 'coreGlow 6s ease-in-out infinite alternate'
      }} />
      {items.map((item, i) => (
        <div key={i} className="sphere-item" style={{
          position: 'absolute',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 2.2vw, 1.6rem)',
          color: i % 3 === 0 ? 'var(--accent)' : 'var(--white)',
          whiteSpace: 'nowrap',
          willChange: 'transform, opacity',
          textShadow: i % 3 === 0 ? '0 0 15px rgba(198,255,0,0.3)' : 'none',
          transition: 'color 0.3s, text-shadow 0.3s',
          cursor: 'default'
        }}
        onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.textShadow = '0 0 20px #fff'; }}
        onMouseLeave={e => { e.target.style.color = i % 3 === 0 ? 'var(--accent)' : 'var(--white)'; e.target.style.textShadow = i % 3 === 0 ? '0 0 15px rgba(198,255,0,0.3)' : 'none'; }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function TerminalBar({ name, level, index }) {
  const barRef = useRef(null);
  const numRef = useRef(null);

  const totalBlocks = 18;
  const activeBlocks = Math.round((level / 100) * totalBlocks);
  
  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(barRef.current, { opacity: 1 });
      gsap.set(barRef.current.querySelectorAll('.segment'), { opacity: (i) => i < activeBlocks ? 1 : 0.1 });
      if (numRef.current) numRef.current.innerText = `${level}%`;
      return;
    }
    const st = ScrollTrigger.create({
      trigger: barRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(barRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
        );
        gsap.fromTo(barRef.current.querySelectorAll('.segment'),
          { opacity: 0 },
          {
            opacity: (i) => i < activeBlocks ? 1 : 0.1,
            stagger: 0.02,
            duration: 0.25,
            ease: 'power1.out',
            onComplete: () => {
              const shimmer = barRef.current.querySelector('.bar-shimmer');
              if (shimmer) shimmer.style.animationPlayState = 'running';
            }
          }
        );
        
        const obj = { val: 0 };
        gsap.to(obj, {
          val: level,
          duration: 0.6,
          ease: 'power2.out',
          onUpdate: () => {
            if (numRef.current) numRef.current.innerText = Math.round(obj.val) + '%';
          }
        });
      }
    });
    return () => st.kill();
  }, [level]);

  return (
    <div ref={barRef} style={{ opacity: 0, marginBottom: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
        <span style={{ color: 'var(--white)', letterSpacing: '0.05em' }}>{name}</span>
        <span ref={numRef} style={{ color: 'var(--accent)' }}>0%</span>
      </div>
      <div style={{
        display: 'flex',
        gap: '2px',
        background: 'rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.05)',
        padding: '3px 5px',
        borderRadius: '4px',
        height: '14px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="bar-shimmer" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
            animation: 'barShimmer 0.9s ease-out 1',
            animationPlayState: 'paused',
            zIndex: 1, pointerEvents: 'none', transform: 'translateX(-100%)'
        }} />
        {Array.from({ length: totalBlocks }).map((_, i) => (
          <div
            key={i}
            className="segment"
            style={{
              flex: 1, height: '100%', borderRadius: '1px',
              background: i < activeBlocks ? 'linear-gradient(90deg, var(--accent), var(--accent-alt))' : 'rgba(255,255,255,0.06)',
              boxShadow: i < activeBlocks ? '0 0 6px var(--glow)' : 'none',
              opacity: 0
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const secRef = useRef(null);
  const terminalRef = useRef(null);
  const [activeCode, setActiveCode] = useState(null);

  const allTags = [...DATA.skills.map(s => s.name), ...DATA.orbs, 'GraphQL', 'AWS', 'MongoDB', 'WebGL', 'Three.js'];
  const sphereItems = [...allTags, ...allTags];

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set('.skills-label, .cap-char, .categories-grid > div', { opacity: 1, x: 0, y: 0, rotate: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo('.skills-label', { x: -40, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.7,
        scrollTrigger: { trigger: secRef.current, start: 'top 80%', once: true }
      });

      const letters = secRef.current?.querySelectorAll('.cap-char');
      if (letters?.length) {
        gsap.fromTo(letters,
          {
            x: () => gsap.utils.random(-150, 150),
            y: () => gsap.utils.random(-150, 150),
            opacity: 0,
            rotate: () => gsap.utils.random(-30, 30)
          },
          {
            x: 0, y: 0, opacity: 1, rotate: 0,
            stagger: 0.04, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: secRef.current, start: 'top 80%', once: true }
          }
        );
      }

      gsap.fromTo('.categories-grid > div', 
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: '.categories-grid', start: 'top 80%', once: true }
        }
      );

      gsap.to('.skills-keyword-cloud', {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: secRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    }, secRef);

    // Refresh ScrollTrigger after lazy-loaded content mounts
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (activeCode && terminalRef.current) {
      gsap.fromTo(terminalRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
      window.__lenis?.scrollTo(terminalRef.current, { offset: -100, duration: 1.2 });
    }
  }, [activeCode]);

  const capText = 'CAPABILITIES';

  return (
    <section id="skills" ref={secRef} style={{
      background: 'linear-gradient(180deg, transparent, rgba(198,255,0,0.02), transparent)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '100px 0'
    }}>
      <div className="skills-keyword-cloud" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {DATA.skills.map((s, i) => (
          <div key={s.name} style={{
            position: 'absolute',
            left: `${10 + (i * 13) % 80}%`,
            top: `${5 + (i * 17) % 85}%`,
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            opacity: 0.03,
            transform: `rotate(${-30 + i * 11}deg)`,
            whiteSpace: 'nowrap',
            animation: `float${i % 3} ${25 + i * 3}s ease-in-out infinite`,
            userSelect: 'none',
          }}>{s.name}</div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '0 5vw', width: '100%' }}>
        <p className="section-label skills-label" style={{ opacity: 0, marginBottom: '1rem' }}>SKILLS</p>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 9vw, 7rem)',
          lineHeight: 0.9, marginBottom: '4rem', letterSpacing: '-0.01em'
        }}>
          {capText.split('').map((c, i) => (
            <span key={i} className="cap-char" style={{ display: 'inline-block' }}>{c}</span>
          ))}
        </div>

        <div className="skills-classic-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '4rem', alignItems: 'center', marginTop: '2rem'
        }}>
          <div>
            <SkillSphere items={sphereItems} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.15em', opacity: 0.5, marginBottom: '0.5rem', fontFamily: 'var(--font-body)' }}>CORE CAPABILITIES</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }} className="categories-grid">
              {categories.map(cat => (
                <div key={cat.id} className="bento-card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                    <span style={{ color: 'var(--accent)' }}>{cat.tag}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>LOG_OK</span>
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '0.02em', color: 'var(--white)', margin: 0 }}>{cat.title}</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {cat.skills.map((s, idx) => (
                      <TerminalBar key={s.name} {...s} index={idx} />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setActiveCode(activeCode === cat.id ? null : cat.id)}
                    className="btn-outline"
                    style={{ fontSize: '0.6rem', padding: '0.45rem 0.8rem', width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Icon name="code" size={12} />
                      {activeCode === cat.id ? 'CLOSE SYSTEM' : 'INSPECT SYSTEM'}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Developer Console Code block Drawer */}
        {activeCode && (
          <div ref={terminalRef} className="terminal-viewer glass" style={{ marginTop: '3rem', border: '1px dashed var(--accent)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.65rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.1em' }}>
                {activeCode === 'ai' ? 'langgraph_agent.py' : activeCode === 'frontend' ? 'MotionCanvas.jsx' : activeCode === 'backend' ? 'search_api.py' : 'Dockerfile'}
              </span>
            </div>
            
            <pre style={{ margin: 0, padding: '1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', background: 'rgba(0,0,0,0.3)', color: '#9dffa7' }}>
              <code>
                {codeSnippets[activeCode]}
              </code>
            </pre>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes pulseGlow {
          0% { opacity: 0.1; transform: scale(0.9); }
          100% { opacity: 0.2; transform: scale(1.1); }
        }
        @keyframes float0 { 0%,100%{transform:translateY(0) rotate(-15deg)} 50%{transform:translateY(-20px) rotate(-15deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(10deg)} 50%{transform:translateY(15px) rotate(10deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(-25deg)} 50%{transform:translateY(-12px) rotate(-25deg)} }
        
        @media (max-width: 990px) {
          .skills-classic-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
        @media (max-width: 600px) {
          .categories-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
