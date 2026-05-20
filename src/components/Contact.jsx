import React, { useEffect, useRef, useState } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  TorusKnotGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import { DATA } from "../data";
import { prefersReducedMotion } from "../motion";
import Icon from "./Icon";

gsap.registerPlugin(ScrollTrigger);

/* ─── EmailJS config ─────────────────────────────────────
   1. Sign up free at https://emailjs.com
   2. Create a service, a template (fields: from_name, from_email, message)
   3. Replace the 3 values below with your own
   ───────────────────────────────────────────────────────── */
const EJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EJS_PUBLIC = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const isEmailConfigured = Boolean(EJS_SERVICE && EJS_TEMPLATE && EJS_PUBLIC);

export default function Contact() {
  const canvasRef = useRef(null);
  const secRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  /* Three.js torus knot wireframe */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new Scene();
    const camera = new PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 6;

    const setSize = () => {
      const w = canvas.offsetWidth || window.innerWidth;
      const h = canvas.offsetHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setSize();

    // Adjust geometry segments based on device width to save battery and increase performance on mobile
    const isMobile = window.innerWidth <= 768;
    const geo = new TorusKnotGeometry(
      2,
      0.5,
      isMobile ? 64 : 100,
      isMobile ? 8 : 16,
    );
    const isVolt = getComputedStyle(document.documentElement).getPropertyValue('--theme-id').trim() === 'volt';
    const mat = new MeshBasicMaterial({
      color: isVolt ? 0xc6ff00 : 0x00eeff,
      wireframe: true,
      opacity: 0.14,
      transparent: true,
    });
    const mesh = new Mesh(geo, mat);
    scene.add(mesh);

    const geo2 = new TorusKnotGeometry(
      3,
      0.3,
      isMobile ? 48 : 80,
      isMobile ? 8 : 12,
    );
    const mat2 = new MeshBasicMaterial({
      color: isVolt ? 0x00ffb2 : 0x7b61ff,
      wireframe: true,
      opacity: 0.09,
      transparent: true,
    });
    const mesh2 = new Mesh(geo2, mat2);
    mesh2.rotation.z = Math.PI / 4;
    scene.add(mesh2);

    let rafId;
    let isVisible = true;
    let targetSpeedY = 0.005;
    let targetSpeedX = 0.003;
    let baseScale2 = 1;

    const onFormFocus = () => { targetSpeedY = 0.022; targetSpeedX = 0.012; };
    const onFormBlur = () => { targetSpeedY = 0.005; targetSpeedX = 0.003; };
    const onFormType = () => { baseScale2 = 1.08; setTimeout(() => baseScale2 = 1, 150); };

    window.addEventListener('form-focus', onFormFocus);
    window.addEventListener('form-blur', onFormBlur);
    window.addEventListener('form-type', onFormType);

    const startColor = isVolt ? { r: 0.776, g: 1.0, b: 0.0 } : { r: 0.0, g: 0.94, b: 1.0 };
    const targetColor = isVolt ? { r: 0.0, g: 0.94, b: 1.0 } : { r: 0.48, g: 0.38, b: 1.0 };

    let hueTween = gsap.to(mat.color, {
      r: targetColor.r, g: targetColor.g, b: targetColor.b,
      duration: 6, ease: 'sine.inOut',
      yoyo: true, repeat: -1
    });

    const onThemeChange = e => {
      const volt = e.detail === 'volt';
      mat.color.setHex(volt ? 0xc6ff00 : 0x00eeff);
      mat2.color.setHex(volt ? 0x00ffb2 : 0x7b61ff);
      
      hueTween.kill();
      const nextTarget = volt ? { r: 0.0, g: 0.94, b: 1.0 } : { r: 0.48, g: 0.38, b: 1.0 };
      gsap.killTweensOf(mat.color);
      hueTween = gsap.to(mat.color, {
        r: nextTarget.r, g: nextTarget.g, b: nextTarget.b,
        duration: 6, ease: 'sine.inOut',
        yoyo: true, repeat: -1
      });
    };
    window.addEventListener('theme-change', onThemeChange);

    const animate = () => {
      if (!isVisible) return;

      const t = Date.now() * 0.001;

      // Organic breathing drift
      mesh.rotation.x += targetSpeedX + Math.sin(t * 0.2) * 0.001;
      mesh.rotation.y += targetSpeedY;
      mesh.position.y = Math.sin(t * 0.5) * 0.15;

      mesh2.rotation.x -= 0.002;
      mesh2.rotation.y += targetSpeedX + Math.cos(t * 0.3) * 0.001;
      mesh2.scale.setScalar(baseScale2 + Math.sin(t * 0.4) * 0.04);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) rafId = requestAnimationFrame(animate);
        else cancelAnimationFrame(rafId);
      },
      { threshold: 0.01 },
    );

    observer.observe(canvas);
    animate();

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setSize, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener('form-focus', onFormFocus);
      window.removeEventListener('form-blur', onFormBlur);
      window.removeEventListener('form-type', onFormType);
      window.removeEventListener('theme-change', onThemeChange);
      hueTween.kill();
      geo.dispose();
      mat.dispose();
      geo2.dispose();
      mat2.dispose();
      renderer.dispose();
    };
  }, []);

  /* Entrance animations */
  useEffect(() => {
    const st = secRef.current;
    if (prefersReducedMotion()) {
      gsap.set(
        ".contact-label, .contact-big, .contact-sub, .social-link, .contact-form-row",
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
        },
      );
      return;
    }

    // Section label
    gsap.fromTo(
      ".contact-label",
      { x: -40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        scrollTrigger: { trigger: st, start: "top 75%", once: true },
      },
    );

    // Big heading + Scramble Effect
    gsap.fromTo(
      ".contact-big",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: st, start: "top 75%", once: true },
        onStart: () => {
          const chars = "!<>-_\\\\/[]{}—=+*^?#________";
          document
            .querySelectorAll(".contact-big .scramble-text")
            .forEach((el, index) => {
              const original = el.getAttribute("data-text");
              let iterations = 0;
              const max = 40;
              setTimeout(() => {
                const scramble = () => {
                  if (iterations >= max) {
                    el.innerText = original;
                    return;
                  }
                  const p = iterations / max;
                  let res = "";
                  for (let i = 0; i < original.length; i++) {
                    if (original[i] === " ") {
                      res += " ";
                      continue;
                    }
                    if (i < original.length * p) res += original[i];
                    else res += chars[Math.floor(Math.random() * chars.length)];
                  }
                  el.innerText = res;
                  iterations++;
                  requestAnimationFrame(scramble);
                };
                requestAnimationFrame(scramble);
              }, index * 200); // Stagger the scramble effect
            });
        },
      },
    );

    // Email + socials row
    gsap.fromTo(
      ".contact-sub",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay: 0.2,
        scrollTrigger: { trigger: st, start: "top 75%", once: true },
      },
    );

    // Social links stagger
    gsap.fromTo(
      ".social-link",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.4,
        scrollTrigger: { trigger: st, start: "top 75%", once: true },
      },
    );

    // Form fields stagger in
    gsap.fromTo(
      ".contact-form-row",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.35,
        scrollTrigger: { trigger: st, start: "top 70%", once: true },
      },
    );

    // Breathing pulse on big text
    gsap.to(".contact-big", {
      scale: 1.008,
      repeat: -1,
      yoyo: true,
      duration: 3,
      ease: "sine.inOut",
    });

    // Refresh ScrollTrigger after lazy-loaded content mounts
    ScrollTrigger.refresh();
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(DATA.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!isEmailConfigured) {
      const body = encodeURIComponent(
        `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`,
      );
      const subject = encodeURIComponent("Portfolio Contact");
      window.location.href = `mailto:${DATA.email}?subject=${subject}&body=${body}`;
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    try {
      await emailjs.send(
        EJS_SERVICE,
        EJS_TEMPLATE,
        {
          from_name: formState.name,
          from_email: formState.email,
          message: formState.message,
        },
        EJS_PUBLIC,
      );
      setSubmitted(true);
      setFormError(""); // Clear any previous errors on success
    } catch (err) {
      console.error(err);
      setFormError(
        "Failed to send message. Please click the email link directly to reach out.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={secRef}
      className="contact-section"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(198,255,0,0.05) 0%, transparent 70%)",
        textAlign: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "900px",
          width: "100%",
          padding: "0 5vw",
        }}
      >
        <p
          className="section-label contact-label"
          style={{ opacity: 0, textAlign: "center" }}
        >
          CONTACT
        </p>

        <div
          className="contact-big"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            marginBottom: "2.5rem",
          }}
        >
          <span
            className="scramble-text"
            data-text="LET'S BUILD"
            style={{ color: "var(--white)", display: "block" }}
          >
            LET'S BUILD
          </span>
          <span
            className="scramble-text"
            data-text="SOMETHING."
            style={{ color: "var(--accent)", display: "block" }}
          >
            SOMETHING.
          </span>
        </div>

        <div className="contact-sub" style={{ marginBottom: "2.5rem" }}>
          <button
            id="copy-email-btn"
            onClick={copyEmail}
            style={{
              background: "none",
              border: "none",
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
              color: "var(--white)",
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                position: "absolute",
                bottom: "-4px",
                left: 0,
                right: 0,
                height: "1px",
                background: "var(--accent)",
                transform: "scaleX(0.3)",
                transformOrigin: "left",
                transition: "transform 0.3s",
              }}
              className="email-underline"
            />
            <Icon name="mail" size={17} />
            {DATA.email}
          </button>
          {copied && (
            <div
              style={{
                display: "inline-block",
                marginLeft: "1rem",
                fontSize: "0.75rem",
                color: "var(--bg)",
                background: "var(--accent)",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                animation: "toastIn 0.3s ease-out",
              }}
            >
              COPIED!
            </div>
          )}
        </div>

        <div
          className="contact-socials"
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          {[
            { label: "GitHub", href: DATA.github, icon: "github" },
            { label: "LinkedIn", href: DATA.linkedin, icon: "linkedin" },
          ]
            .filter((s) => s.href)
            .map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "var(--white)",
                  textDecoration: "none",
                  position: "relative",
                  transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  opacity: 0,
                }}
                className="social-link"
              >
                <Icon name={s.icon} size={16} />
                {s.label}
              </a>
            ))}
        </div>

        {/* Contact form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="contact-form"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty(
                "--mouse-x",
                `${e.clientX - rect.left}px`,
              );
              e.currentTarget.style.setProperty(
                "--mouse-y",
                `${e.clientY - rect.top}px`,
              );
            }}
          >
            {formError && (
              <div
                className="contact-form-row form-error"
                style={{
                  gridColumn: "1 / -1",
                  color: "#ff4d4f",
                  background: "rgba(255, 77, 79, 0.1)",
                  border: "1px solid #ff4d4f",
                  padding: "0.8rem",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  textAlign: "center",
                }}
              >
                {formError}
              </div>
            )}

            {["Name", "Email"].map((f) => (
              <div
                key={f}
                className="contact-form-row form-input-wrap"
                style={{ opacity: 0 }}
              >
                <input
                  id={`contact-${f.toLowerCase()}`}
                  type={f === "Email" ? "email" : "text"}
                  value={formState[f.toLowerCase()]}
                  onChange={(e) => {
                    window.dispatchEvent(new Event('form-type'));
                    setFormState((p) => ({
                      ...p,
                      [f.toLowerCase()]: e.target.value,
                    }));
                  }}
                  onFocus={() => window.dispatchEvent(new Event('form-focus'))}
                  onBlur={() => window.dispatchEvent(new Event('form-blur'))}
                  placeholder=" "
                  required
                  className="liquid-input"
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(198,255,0,0.2)",
                    color: "var(--white)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    padding: "0.5rem 0",
                    outline: "none",
                    transition: "border-color 0.3s",
                    position: "relative",
                    zIndex: 2,
                  }}
                />
                <label
                  htmlFor={`contact-${f.toLowerCase()}`}
                  className="liquid-label"
                >
                  {f.toUpperCase()}
                </label>
              </div>
            ))}
            <div
              className="contact-form-row form-input-wrap"
              style={{ gridColumn: "1/-1", position: "relative", opacity: 0 }}
            >
              <textarea
                id="contact-message"
                value={formState.message}
                onChange={(e) => {
                  window.dispatchEvent(new Event('form-type'));
                  setFormState((p) => ({ ...p, message: e.target.value }));
                }}
                onFocus={() => window.dispatchEvent(new Event('form-focus'))}
                onBlur={() => window.dispatchEvent(new Event('form-blur'))}
                placeholder=" "
                rows={3}
                required
                className="liquid-input"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(198,255,0,0.2)",
                  color: "var(--white)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  padding: "0.5rem 0",
                  outline: "none",
                  resize: "none",
                  transition: "border-color 0.3s",
                  position: "relative",
                  zIndex: 2,
                }}
              />
              <label
                htmlFor="contact-message"
                className="liquid-label"
              >
                MESSAGE
              </label>
            </div>
            <div
              className="contact-form-row"
              style={{ gridColumn: "1/-1", textAlign: "center", opacity: 0 }}
            >
              <button
                id="contact-submit-btn"
                type="submit"
                className="btn-primary"
                disabled={submitting}
                style={{ minWidth: "200px", justifyContent: "center" }}
              >
                {submitting ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                    }}
                  >
                    <span className="btn-spinner" /> SENDING...
                  </span>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Icon name="send" size={15} />
                    SEND MESSAGE
                  </span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div
            style={{
              fontFamily: "var(--font-display)",
              animation: "toastIn 0.6s cubic-bezier(0.34,1.56,0.64,1)",
              padding: "2rem 0",
            }}
          >
            <div
              style={{
                fontSize: "clamp(2.5rem, 8vw, 4rem)",
                color: "var(--accent)",
                marginBottom: "1rem",
              }}
            >
              SUCCESS!
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--white)",
                opacity: 0.6,
                letterSpacing: "0.05em",
              }}
            >
              Your message has been transmitted successfully.
              <br />
              I'll get back to you shortly.
            </p>
          </div>
        )}
      </div>

      <footer
        className="contact-footer"
        style={{
          position: "absolute",
          bottom: "2rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          opacity: 0.3,
          letterSpacing: "0.05em",
          textAlign: "center",
          width: "100%",
        }}
      >
        (c) 2026 {DATA.name} - DESIGNED AND BUILT WITH REACT
      </footer>

      <style>{`
        @keyframes toastIn { from { transform: scale(0.8) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes toastOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.8); opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.1); border-top-color: #000; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .social-link::after { content: ''; position: absolute; bottom: -3px; left: 0; right: 0; height: 1px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .social-link:hover::after { transform: scaleX(1); }
        .social-link:hover { transform: translateY(-6px) !important; }
        button:hover .email-underline { transform: scaleX(1) !important; }
        
        .contact-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          background: rgba(10, 10, 15, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
          z-index: 10;
        }
        
        .contact-form::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(198,255,0,0.06), transparent 75%);
          z-index: 0; transition: opacity 0.5s ease; opacity: 0;
        }
        .contact-form:hover::before { opacity: 1; }
        
        .form-input-wrap {
          position: relative;
          margin-top: 1rem;
          z-index: 1;
        }
        
        .liquid-label {
          position: absolute;
          left: 0;
          top: 0.5rem;
          font-family: var(--font-body);
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.45);
          pointer-events: none;
          transition: transform 0.3s cubic-bezier(0.25, 1, 0.3, 1), color 0.3s, font-size 0.3s;
          transform-origin: left top;
          z-index: 2;
        }
        
        .liquid-input:focus ~ .liquid-label,
        .liquid-input:not(:placeholder-shown) ~ .liquid-label {
          transform: translateY(-1.3rem) scale(0.9);
          color: var(--accent);
        }
        
        .liquid-input:focus {
          border-bottom-color: var(--accent) !important;
        }
        
        @media (max-width: 768px) {
          .contact-section {
            justify-content: flex-start !important;
            padding-top: 96px !important;
            padding-bottom: 96px !important;
          }
          .contact-socials {
            flex-wrap: wrap;
            gap: 1rem 1.5rem !important;
          }
          .contact-form {
            grid-template-columns: 1fr !important;
            padding: 1.5rem !important;
            gap: 1.5rem !important;
          }
          .contact-form-row { grid-column: 1/-1 !important; }
          .contact-big {
            font-size: clamp(3.2rem, 18vw, 5.8rem) !important;
            margin-bottom: 1.6rem !important;
          }
          .contact-sub button {
            max-width: 100%;
            overflow-wrap: anywhere;
            line-height: 1.6;
          }
          .contact-form .btn-primary {
            width: 100%;
          }
          .contact-footer {
            bottom: 1rem !important;
            padding: 0 1rem;
            line-height: 1.6;
          }
        }
      `}</style>
    </section>
  );
}
