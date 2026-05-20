import React, {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Icon from "./components/Icon";
import { DATA } from "./data";
import { prefersReducedMotion } from "./motion";

gsap.registerPlugin(ScrollTrigger);

const About = lazy(() => import("./components/About"));
const Work = lazy(() => import("./components/Work"));
const Marquee = lazy(() => import("./components/Marquee"));
const Skills = lazy(() => import("./components/Skills"));
const Experience = lazy(() => import("./components/Experience"));
const Contact = lazy(() => import("./components/Contact"));

function SectionFallback() {
  return <section aria-hidden="true" style={{ minHeight: "100svh" }} />;
}

/* ---- Page Loader ---- */
function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const topRef = useRef(null);
  const botRef = useRef(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  /* Skip all animation for users who prefer reduced motion */
  if (prefersReducedMotion()) {
    useEffect(() => {
      onDone();
    }, []);
    return null;
  }

  useEffect(() => {
    const MIN_MS = 1800;
    const startTs = Date.now();
    let readyFired = document.readyState === "complete";
    let animDone = false;

    /* ── Curtain-wipe exit ── */
    const maybeExit = () => {
      if (!readyFired || !animDone) return;
      const delay = Math.max(0, MIN_MS - (Date.now() - startTs)) / 1000;
      const exitTl = gsap.timeline({ delay });

      exitTl
        .to(".loader-init-char", {
          scale: 1.08,
          duration: 0.18,
          ease: "power2.out",
          stagger: { each: 0.04, from: "center" },
        })
        .to(".loader-init-char", {
          scale: 1,
          duration: 0.1,
          ease: "power1.in",
        })
        .to(
          topRef.current,
          {
            y: "-101%",
            duration: 0.85,
            ease: "power3.inOut",
          },
          "+=0.04",
        )
        .to(
          botRef.current,
          {
            y: "101%",
            duration: 0.85,
            ease: "power3.inOut",
            onStart: () => {
              setTimeout(() => onDoneRef.current(), 350);
            },
          },
          "<",
        );
    };

    const onLoad = () => {
      readyFired = true;
      maybeExit();
    };
    if (document.readyState !== "complete") {
      window.addEventListener("load", onLoad, { once: true });
    }

    /* ── Main Loading Sequence ── */
    const ctx = gsap.context(() => {
      const counter = { val: 0 };
      const tl = gsap.timeline();

      tl
        /* 1. Initials drop in */
        .fromTo(
          ".loader-init-char",
          { y: "110%" },
          { y: "0%", stagger: 0.06, duration: 0.5, ease: "power3.out" },
        )
        /* 2. Counter & Progress bar */
        .to(
          counter,
          {
            val: 100,
            duration: 1.8,
            ease: "power2.inOut",
            onUpdate() {
              const real = Math.round(counter.val);
              if (Math.random() < 0.08 && real < 94) {
                setPct(Math.min(99, real + Math.floor(Math.random() * 20)));
              } else {
                setPct(real);
              }
            },
            onComplete: () => {
              setPct(100);
              animDone = true;
              maybeExit();
            },
          },
          0.1,
        )
        .fromTo(
          ".loader-bar-fill",
          { width: "0%" },
          { width: "100%", duration: 1.8, ease: "power2.inOut" },
          0.1,
        )
        .fromTo(
          ".loader-bar-spark",
          { left: "0%", opacity: 1 },
          {
            left: "calc(100% - 4px)",
            opacity: 0,
            duration: 1.7,
            ease: "power2.inOut",
          },
          0.1,
        )
        /* 3. Infinite effects */
        .to(
          ".loader-p-char",
          {
            textShadow:
              "0 0 80px var(--glow), 0 0 20px var(--glow)",
            repeat: -1,
            yoyo: true,
            duration: 1.1,
            ease: "sine.inOut",
          },
          0.5,
        )
        .fromTo(
          ".loader-scanline",
          { top: "-10%", opacity: 0 },
          {
            top: "110%",
            opacity: 0.6,
            duration: 1.5,
            ease: "none",
            repeat: -1,
          },
          0.4,
        )
        /* 4. Subtitles */
        .fromTo(
          ".loader-role",
          { opacity: 0, y: 10 },
          { opacity: 0.45, y: 0, duration: 0.5 },
          0.3,
        )
        .fromTo(
          ".loader-meta",
          { opacity: 0 },
          { opacity: 0.2, duration: 0.8, stagger: 0.1 },
          0.6,
        );
    });

    return () => {
      ctx.revert();
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99997,
        pointerEvents: "none",
      }}
    >
      {/* ── Top curtain panel ── */}
      <div
        ref={topRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "var(--bg)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "2.5rem",
          overflow: "hidden",
        }}
      >
        {/* Corner Meta Left */}
        <div
          className="loader-meta"
          style={{
            position: "absolute",
            left: "2rem",
            top: "2rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.55rem",
            letterSpacing: "0.15em",
            opacity: 0,
          }}
        >
          SYSTEM_STATUS: <span style={{ color: "var(--accent)" }}>ACTIVE</span>
        </div>

        {/* Initials Container */}
        <div
          style={{
            position: "relative",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(6rem, 18vw, 12rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            overflow: "hidden",
            display: "flex",
          }}
        >
          {/* Scanline Effect */}
          <div
            className="loader-scanline"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, var(--accent), transparent)",
              zIndex: 10,
              pointerEvents: "none",
              boxShadow: "0 0 15px var(--accent)",
            }}
          />

          {["R", "P"].map((c, i) => (
            <span
              key={c}
              className={`loader-init-char${i === 1 ? " loader-p-char" : ""}`}
              style={{
                display: "inline-block",
                color: i === 0 ? "var(--white)" : "var(--accent)",
                textShadow: i === 1 ? "0 0 60px var(--glow)" : "none",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── Center divider line ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "1px",
          transform: "translateY(-0.5px)",
          background:
            "linear-gradient(90deg, transparent 0%, var(--glow) 50%, transparent 100%)",
        }}
      />

      {/* ── Bottom curtain panel ── */}
      <div
        ref={botRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "2.5rem",
          overflow: "hidden",
        }}
      >
        {/* Corner Meta Right */}
        <div
          className="loader-meta"
          style={{
            position: "absolute",
            right: "2rem",
            bottom: "2rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.55rem",
            letterSpacing: "0.15em",
            opacity: 0,
          }}
        >
          LOC: <span style={{ color: "var(--accent)" }}>VADODARA_IN</span>
        </div>

        {/* Role subtitle */}
        <p
          className="loader-role"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.68rem",
            letterSpacing: "0.22em",
            color: "var(--accent)",
            marginBottom: "2rem",
            opacity: 0,
          }}
        >
          FULL-STACK DEVELOPER &amp; AI/ML ENGINEER
        </p>

        {/* Progress bar + counter */}
        <div style={{ width: "min(300px, 72vw)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "0.55rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                opacity: 0.3,
              }}
            >
              INITIALIZING
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                color: "var(--accent)",
                lineHeight: 1,
                display: "inline-block",
                minWidth: "3ch",
                textAlign: "right",
              }}
            >
              {pct}%
            </span>
          </div>

          <div
            style={{
              height: "2px",
              background: "rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "visible",
            }}
          >
            <div
              className="loader-bar-fill"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: "0%",
                background: "var(--accent)",
                boxShadow: "0 0 14px rgba(198,255,0,0.5)",
              }}
            />
            <div
              className="loader-bar-spark"
              style={{
                position: "absolute",
                top: "-3px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 0 10px 3px rgba(198,255,0,0.9), 0 0 4px 1px #fff",
                opacity: 0,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Easter Egg Particle Burst ---- */
const EasterEggBurst = forwardRef((_, ref) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useImperativeHandle(ref, () => ({
    trigger() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.style.display = "block";
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const PARTICLE_COUNT = 120;

      const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 4 + Math.random() * 10;
        return {
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.018,
          radius: 2 + Math.random() * 4,
          hue: Math.random() > 0.3 ? "#C6FF00" : "#00EEFF",
        };
      });

      cancelAnimationFrame(rafRef.current);
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.vy += 0.15; // gravity
          p.life -= p.decay;
          if (p.life <= 0) return;
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.hue;
          ctx.shadowColor = p.hue;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        if (alive) rafRef.current = requestAnimationFrame(draw);
        else canvas.style.display = "none";
      };
      rafRef.current = requestAnimationFrame(draw);
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 99995,
        pointerEvents: "none",
        display: "none",
      }}
    />
  );
});
EasterEggBurst.displayName = "EasterEggBurst";

/* ---- Sound Toggle ---- */
function SoundToggle() {
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem("soundEnabled") === "true";
    } catch {
      return false;
    }
  });
  const ctxRef = useRef(null);

  const getAudioCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const toggleSound = () => {
    setOn((prev) => {
      const next = !prev;
      localStorage.setItem("soundEnabled", next);
      return next;
    });
  };

  const playTone = useCallback(
    (freq = 440, dur = 0.08) => {
      if (!on) return;
      const ac = getAudioCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
      osc.start();
      osc.stop(ac.currentTime + dur);
    },
    [on, getAudioCtx],
  );

  useEffect(() => {
    if (!on) return;
    const links = document.querySelectorAll(
      "a, button, .project-card, .btn-outline",
    );
    const playHover = () => playTone(660, 0.06);
    links.forEach((el) => el.addEventListener("mouseenter", playHover));

    // Ambient whoosh for sections — reuses global AudioContext
    const playWhoosh = () => {
      if (!on) return;
      const ac = getAudioCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const filter = ac.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(40, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ac.currentTime + 0.8);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, ac.currentTime);

      gain.gain.setValueAtTime(0, ac.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ac.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      osc.start();
      osc.stop(ac.currentTime + 0.8);
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playWhoosh();
          }
        });
      },
      { threshold: 0.1 },
    );

    document
      .querySelectorAll("section")
      .forEach((sec) => sectionObserver.observe(sec));

    return () => {
      links.forEach((el) => el.removeEventListener("mouseenter", playHover));
      sectionObserver.disconnect();
    };
  }, [on, playTone, getAudioCtx]);

  return (
    <button
      onClick={toggleSound}
      aria-label={on ? "Mute sound" : "Enable sound"}
      title={on ? "Sound on" : "Sound off"}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9000,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "50%",
        width: "44px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 0,
        backdropFilter: "blur(8px)",
        fontFamily: "var(--font-body)",
        letterSpacing: "0.08em",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: on ? "0 0 16px var(--glow)" : "none",
        borderColor: on ? "var(--accent)" : "rgba(255,255,255,0.1)",
      }}
    >
      <Icon name={on ? "soundOn" : "soundOff"} size={18} />
    </button>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [ambientColor, setAmbientColor] = useState("rgba(198,255,0,0.05)");
  const burstRef = useRef(null);
  const lenisRef = useRef(null);

  /* ── Lenis smooth scroll + GSAP ScrollTrigger sync ── */
  useEffect(() => {
    const reduceMotion = prefersReducedMotion();
    const lenis = new Lenis({
      duration: reduceMotion ? 0.1 : 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease
      orientation: "vertical",
      smoothWheel: !reduceMotion,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis; // expose globally for Navbar / Hero scroll buttons

    // Sync Lenis scroll position to GSAP ScrollTrigger
    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      document.documentElement.style.setProperty(
        "--scroll-progress",
        (e.progress * 100) + "%"
      );
    });

    // Drive Lenis via GSAP ticker for perfect frame sync
    const tickLenis = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickLenis);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger when lazy-loaded components finish rendering to prevent layout shifts messing up trigger points
    const handleRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleRefresh);
    setTimeout(handleRefresh, 1000); // Failsafe for initial DOM setup

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickLenis);
      window.removeEventListener("load", handleRefresh);
      if (window.__lenis === lenis) window.__lenis = null;
    };
  }, []);


  /* ── Section ambient glow shift ── */
  useEffect(() => {
    const sectionGlows = [
      { id: "home", color: "rgba(198,255,0,0.06)" }, // lime
      { id: "about", color: "rgba(255,255,255,0.02)" }, // neutral
      { id: "work", color: "rgba(0,238,255,0.05)" }, // neon cyan
      { id: "skills", color: "rgba(0,255,178,0.05)" }, // teal
      { id: "experience", color: "rgba(198,255,0,0.04)" }, // soft lime
      { id: "contact", color: "rgba(198,255,0,0.07)" }, // lime strong
    ];

    const observers = sectionGlows.map(({ id, color }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setAmbientColor(color);
        },
        { threshold: 0.25 },
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  /* ── Developer Console Easter Egg ── */
  useEffect(() => {
    const asciiArt = `
  ██████╗  █████╗      ██╗
  ██╔══██╗██╔══██╗     ██║
  ██████╔╝███████║     ██║
  ██╔══██╗██╔══██║██   ██║
  ██║  ██║██║  ██║╚█████╔╝
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝ 
    `;
    console.log(
      `%c${asciiArt}\n%cAh, a fellow developer! 🚀\n%cLooking for bugs? Or maybe my source code? Check out my GitHub: https://github.com/rajpatel637`,
      "color: #00EEFF; font-family: monospace; font-size: 14px; font-weight: bold;",
      "color: #F0F0F0; font-family: sans-serif; font-size: 16px; font-weight: bold; margin-top: 10px;",
      "color: #00EEFF; font-family: sans-serif; font-size: 14px; margin-top: 5px; text-decoration: underline;",
    );
  }, []);

  /* ── Animated Favicon ── */
  useEffect(() => {
    const frames = [">_", " _", ">_", " _"];
    let i = 0;

    // Create an invisible canvas to generate favicon data URLs
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }

    let primaryColor = "#00EEFF";
    let bgColor = "#020813";

    const onThemeChange = e => {
      primaryColor = e.detail === 'volt' ? "#C6FF00" : "#00EEFF";
      bgColor = e.detail === 'volt' ? "#050508" : "#020813";
    };
    window.addEventListener('theme-change', onThemeChange);

    // Initial check on mount
    const isVolt = getComputedStyle(document.documentElement).getPropertyValue('--theme-id').trim() === 'volt';
    primaryColor = isVolt ? "#C6FF00" : "#00EEFF";
    bgColor = isVolt ? "#050508" : "#020813";

    const timer = setInterval(() => {
      ctx.clearRect(0, 0, 32, 32);
      ctx.fillStyle = bgColor; // background
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = primaryColor; // text color
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(frames[i], 16, 18);

      link.href = canvas.toDataURL("image/x-icon");
      i = (i + 1) % frames.length;
    }, 500);

    return () => {
      clearInterval(timer);
      window.removeEventListener('theme-change', onThemeChange);
    };
  }, []);

  /* ── Highly Optimized Global Magnetic Buttons via Delegated Handlers ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let activeBtn = null;
    let rect = null;

    const onMouseMove = (e) => {
      if (!activeBtn || !rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const bx = e.clientX - rect.left;
      const by = e.clientY - rect.top;
      activeBtn.style.setProperty('--x', `${bx}px`);
      activeBtn.style.setProperty('--y', `${by}px`);

      gsap.to(activeBtn, {
        x: dx * 0.35,
        y: dy * 0.35,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMouseOver = (e) => {
      const btn = e.target.closest(".btn-primary, .btn-outline");
      if (btn) {
        activeBtn = btn;
        rect = btn.getBoundingClientRect();
        const bx = e.clientX - rect.left;
        const by = e.clientY - rect.top;
        btn.style.setProperty('--x', `${bx}px`);
        btn.style.setProperty('--y', `${by}px`);
      }
    };

    const onMouseOut = (e) => {
      const btn = e.target.closest(".btn-primary, .btn-outline");
      if (btn && btn === activeBtn) {
        gsap.to(activeBtn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
        activeBtn = null;
        rect = null;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    window.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  /* ── Easter egg keyboard listener ── */
  useEffect(() => {
    let typed = "";
    const target = DATA.initials.toLowerCase();
    const onKey = (e) => {
      typed += e.key.toLowerCase();
      if (typed.length > target.length) typed = typed.slice(-target.length);
      if (typed === target) {
        typed = "";
        burstRef.current?.trigger();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3200);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLoaderDone = useCallback(() => {
    setLoaded(true);
    setTimeout(() => setShowLoader(false), 350);
  }, []);

  return (
    <>
      {showLoader && <Loader onDone={handleLoaderDone} />}
      <EasterEggBurst ref={burstRef} />
      <Cursor />
      <img
        src="/avatar.png"
        aria-hidden="true"
        style={{
          position: "absolute",
          opacity: 0,
          width: 1,
          height: 1,
          pointerEvents: "none",
        }}
      />
      <div className="scroll-progress" />
      <div className="grid-bg" />
      {/* Ambient glow layer — shifts color per section */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 40%, var(--ambient-glow, ${ambientColor}) 0%, transparent 65%)`,
          transition: "background 1.2s ease",
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <About />
          <Work />
          <Marquee />
          <Skills />
          <Experience />
          <Contact />
        </Suspense>
      </main>
      <SoundToggle />
      <div aria-live="polite" aria-atomic="true" style={{ position: 'fixed', bottom: '6rem', left: '50%', transform: 'translateX(-50%)', zIndex: 99996, pointerEvents: 'none' }}>
        {showToast && (
          <div
            role="status"
            style={{
              background: "var(--accent)",
              color: "#000",
              fontFamily: "var(--font-body)",
              fontSize: 0,
              padding: "0.75rem 1.5rem",
              borderRadius: "999px",
              letterSpacing: "0.05em",
              animation:
                "toastIn 0.4s ease-out, toastOut 0.35s 2.8s ease-in forwards",
              boxShadow: "0 0 40px var(--glow)",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>You found the easter egg.</span>
          </div>
        )}
      </div>
      <style>{`
        @keyframes toastIn  { from{transform:translateX(-50%) scale(0.8);opacity:0} to{transform:translateX(-50%) scale(1);opacity:1} }
        @keyframes toastOut { from{transform:translateX(-50%) scale(1);opacity:1} to{transform:translateX(-50%) scale(0.75);opacity:0} }
      `}</style>
    </>
  );
}
