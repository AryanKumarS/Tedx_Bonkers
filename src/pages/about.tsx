"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Silk from "../components/Silk/Silk";
import Footer from "@/components/Footer/Footer";

interface Shape {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: "square" | "circle" | "rectangle" | "rhombus";
  color: string;
  glow: boolean;
}

export default function AboutPage() {
  // ===== Background + cursor stuff (kept) =====
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shapesRef = useRef<Shape[]>([]);

  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // ===== Anchors =====
  const tapSpoutRef = useRef<HTMLSpanElement | null>(null); // start
  const logoBoxRef = useRef<HTMLDivElement | null>(null); // box (observed)
  const logoTargetRef = useRef<HTMLSpanElement | null>(null); // end pin
  const heroRef = useRef<HTMLElement | null>(null);

  // ===== Drop motion =====
  const dropX = useMotionValue(0);
  const dropY = useMotionValue(0);
  const dropScale = useMotionValue(1);
  const dropOpacity = useMotionValue(1);

  const dropXSpring = useSpring(dropX, { damping: 26, stiffness: 260 });
  const dropYSpring = useSpring(dropY, { damping: 26, stiffness: 260 });
  const dropScaleSpring = useSpring(dropScale, { damping: 26, stiffness: 260 });
  const dropOpacitySpring = useSpring(dropOpacity, {
    damping: 26,
    stiffness: 260,
  });

  const [dropInBox, setDropInBox] = useState(false);

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));
  const centerOf = (r: DOMRect) => ({
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
  });

  const computeDropWindow = () => {
    const spout = tapSpoutRef.current;
    const target = logoTargetRef.current;
    const hero = heroRef.current;
    if (!spout || !target || !hero) return null;

    const spoutRect = spout.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();

    const start = centerOf(spoutRect);
    const end = centerOf(targetRect);

    const heroTopDoc = window.scrollY + heroRect.top;
    const scrollStart = heroTopDoc + heroRect.height * 0.1;

    const targetTopDoc = window.scrollY + targetRect.top;
    const scrollEnd = targetTopDoc - window.innerHeight * 0.12;

    return { start, end, scrollStart, scrollEnd, targetRect };
  };

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;

      const shapes = shapesRef.current;

      for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];

        s.x += s.vx;
        s.y += s.vy;

        if (s.x <= 0 || s.x >= W - s.size) s.vx *= -1;
        if (s.y <= 0 || s.y >= H - s.size) s.vy *= -1;

        // subtle glow toggle (cheap, no React state)
        if (Math.random() > 0.995) {
          s.glow = !s.glow;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const updateDrop = () => {
    const a = computeDropWindow();
    if (!a) return;

    const { start, end, scrollStart, scrollEnd, targetRect } = a;

    const yDoc = window.scrollY;
    const t = clamp(
      (yDoc - scrollStart) / Math.max(1, scrollEnd - scrollStart),
      0,
      1,
    );

    // straight vertical fall: locked X
    const x = start.x;

    // gravity-ish easing
    const easeInQuad = t * t;
    const easeInCubic = t * t * t;
    const g = 0.45 * easeInQuad + 0.55 * easeInCubic;

    const y = start.y + (end.y - start.y) * g;

    dropX.set(x);
    dropY.set(y);
    dropScale.set(1 - t * 0.18);

    const dx = x - (targetRect.left + targetRect.width / 2);
    const dy = y - (targetRect.top + targetRect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    const arrived = t > 0.94 && dist < 26;
    setDropInBox(arrived);
    dropOpacity.set(arrived ? 0 : 1);
  };

  // keep aligned across responsive shifts
  useLayoutEffect(() => {
    updateDrop();

    const ro = new ResizeObserver(() => updateDrop());
    if (logoBoxRef.current) ro.observe(logoBoxRef.current);
    if (heroRef.current) ro.observe(heroRef.current);

    const onResize = () => updateDrop();
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateDrop();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Shapes init (reduced to 4) =====
  useEffect(() => {
    const colors = [
      "border-red-500/30",
      "border-red-600/25",
      "border-white/20",
      "border-red-400/35",
    ];
    const centerX = typeof window !== "undefined" ? window.innerWidth / 2 : 960;
    const centerY =
      typeof window !== "undefined" ? window.innerHeight / 2 : 540;

    const shapeConfigs = [
      { type: "circle" as const, size: 85, speed: 2.0 },
      { type: "circle" as const, size: 200, speed: 0.5 },
      { type: "square" as const, size: 130, speed: 1.2 },
      { type: "rhombus" as const, size: 75, speed: 2.3 },
    ];

    const initialShapes: Shape[] = shapeConfigs.map((config, i) => {
      const angle = (i / shapeConfigs.length) * Math.PI * 2;
      const distance = 200 + Math.random() * 300;
      return {
        id: i,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: config.size,
        type: config.type,
        color: colors[Math.floor(Math.random() * colors.length)],
        glow: false,
      };
    });

    shapesRef.current = initialShapes;
  }, []);

  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`,
      );
    };

    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  useEffect(() => {
    let raf = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        raf = 0;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const containerVariants = useMemo(
    () => ({
      initial: {
        boxShadow: "0 0 20px rgba(56, 189, 248, 0.35)",
        borderColor: "rgba(56, 189, 248, 0.5)",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      },
      hover: {
        boxShadow:
          "0 0 40px rgba(235, 0, 40, 0.6), 0 0 20px rgba(56, 189, 248, 0.4)",
        borderColor: "rgba(255, 255, 255, 0.9)",
        backgroundColor: "rgba(10, 10, 10, 0.6)",
        transition: { duration: 0.3 },
      },
    }),
    [],
  );

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-sans selection:bg-red-600 overflow-x-hidden">
      {/* Gradient Background Layer */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        style={{
          background:
            `radial-gradient(circle at 100% 100%, rgba(30,64,175,0.65) 0%, rgba(30,64,175,0.10) 12%, rgba(0,0,0,0) 22%),
             radial-gradient(circle at 0% 0%, rgba(136,19,55,0.48) 0%, rgba(136,19,55,0.08) 12%, rgba(0,0,0,0) 22%),
             #000`,
          zIndex: 0,
        }}
      >
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="absolute h-[180px] w-[180px] rounded-full bg-red-600/20 blur-[60px]"
        />
        <motion.div
          style={{
            x: useSpring(mouseX, { damping: 40, stiffness: 150 }),
            y: useSpring(mouseY, { damping: 40, stiffness: 150 }),
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="absolute h-[120px] w-[120px] rounded-full bg-sky-400/15 blur-[40px]"
        />
      </div>

      {/* Global droplet behind boxes */}
      <motion.div
        className="fixed left-0 top-0 z-20 pointer-events-none"
        style={{
          x: dropXSpring,
          y: dropYSpring,
          scale: dropScaleSpring,
          opacity: dropOpacitySpring,
          translateX: "-50%",
          translateY: "-50%",
          filter: "drop-shadow(0 0 18px rgba(56, 189, 248, 0.55))",
        }}
      ></motion.div>

      <main className="relative z-10 flex flex-col items-center">
        {/* HERO */}
        <section
          ref={heroRef}
          className="relative w-full flex items-center justify-center px-6 overflow-hidden"
          style={{
            height: "calc(var(--vh, 1vh) * 105)",
          }}
        >
          {/* Silk Background */}
          <div className="absolute inset-0 z-0 opacity-60">
            <Silk
              speed={3}
              scale={1}
              color="#1800eb"
              noiseIntensity={1.5}
              rotation={0}
            />
          </div>

          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

          <div className="relative z-10 w-full max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="relative flex flex-col items-center justify-center"
            >
              <motion.h1
                className="hero-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {"ABOUT".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.02,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    className="font-sans-serif"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.div
                className="hero-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.7, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </section>

        {/* Stylish Red Border Partition */}
        <div className="relative z-30 w-full">
          <div className="relative w-full">
            {/* Main border container with glow effect */}
            <div className="relative">
              {/* Silk effect background for the border */}
              <div className="absolute inset-0 overflow-hidden opacity-40">
                <Silk
                  speed={2}
                  scale={0.8}
                  color="#2300eb"
                  noiseIntensity={2}
                  rotation={90}
                />
              </div>

              {/* Animated gradient border */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="relative h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"
                style={{
                  boxShadow:
                    "0 0 20px rgba(56, 189, 248, 0.6), 0 0 40px rgba(56, 189, 248, 0.3)",
                }}
              />

              {/* Top accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                className="absolute top-[-4px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
                style={{
                  boxShadow: "0 0 10px rgba(248, 113, 113, 0.4)",
                }}
              />

              {/* Bottom accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-400/50 to-transparent"
                style={{
                  boxShadow: "0 0 10px rgba(248, 113, 113, 0.4)",
                }}
              />

              {/* Pulsing glow effect */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-600/30 rounded-full blur-md"
              />
            </div>
          </div>
        </div>

        {/* About TED */}
        <section className="relative z-30 w-full max-w-4xl mx-auto px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.h2
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.6em" }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-gray-500 uppercase tracking-[0.6em] text-xs font-semibold mb-6 mt-10"
            >
              ABOUT TED
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-12 rounded-3xl border border-white/15 backdrop-blur-md cursor-default mx-auto"
            style={{
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-gray-300 text-lg leading-relaxed text-center"
            >
              TED is a nonprofit devoted to spreading ideas worth spreading.
              Started as a conference in 1984, TED has grown into a global
              community celebrating human curiosity and the power of ideas to
              change attitudes, lives and ultimately, the world.
            </motion.p>
          </motion.div>
        </section>

        {/* About TEDx */}
        <section className="relative z-30 w-full max-w-4xl mx-auto px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.h2
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.6em" }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-gray-500 uppercase tracking-[0.6em] text-xs font-semibold mb-6"
            >
              ABOUT TEDxNIITUNIVERSITY
            </motion.h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover="hover"
            transition={{ duration: 0.6 }}
            className="p-12 rounded-3xl border backdrop-blur-md cursor-default mx-auto opacity-0 translate-y-10"
          >
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl font-bold mb-6 text-sky-400 text-center"
            >
              Our Mission
            </motion.h4>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-gray-300 text-lg leading-relaxed text-center"
            >
              TEDxNIITUniversity is a platform where ideas worth spreading come
              to life. We bring together innovators, thinkers, and dreamers from
              diverse backgrounds to share insights that inspire change and
              spark conversations.
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "60%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent mt-8 mx-auto"
            />
          </motion.div>
        </section>

        {/* THEME */}
        <section className="relative z-30 w-full max-w-6xl mx-auto px-8 pb-24 md:px-24">
          <div className="flex flex-col md:flex-row gap-12 items-stretch mt-8">
            <motion.div
              variants={containerVariants}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover="hover"
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 p-10 rounded-3xl border backdrop-blur-md cursor-default relative overflow-hidden"
            >
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-sky-300 to-sky-200 bg-clip-text text-transparent"
              >
                The Vision
              </motion.h4>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-gray-300 text-lg leading-relaxed mb-6"
              >
                Rooted in the theme
                <span className="text-sky-300 font-semibold">
                  {" "}
                  SUBLIS - What moves beneath, Moves us all
                </span>{" "}
                the event explores the unseen forces that shape our thoughts,
                actions, and communities. Through powerful ideas and shared
                experiences, it brings what lies beneath the surface into
                conversation. A platform where hidden movements inspire visible
                change.
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "40%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-sky-400 to-transparent"
              />
            </motion.div>

            <motion.div
              ref={logoBoxRef}
              variants={containerVariants}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover="hover"
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1 p-10 rounded-3xl border backdrop-blur-xl cursor-default flex flex-col items-center justify-center group relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                borderColor: "rgba(56, 189, 248, 0.6)",
              }}
            >
              <span
                ref={logoTargetRef}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: 10,
                  height: 10,
                  transform: "translate(-50%, -50%)",
                }}
                aria-hidden="true"
              />

              <motion.div
                initial={false}
                animate={{ opacity: 1, scale: dropInBox ? 1 : 0.98 }}
                transition={{ duration: 0.35 }}
                className="relative z-10 mb-6 mt-8"
              >
                <motion.div
                  initial={false}
                  animate={{
                    opacity: dropInBox ? 1 : 1,
                    scale: dropInBox ? 1.8 : 1.62,
                    rotate: 0,
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="relative w-56 h-56 md:w-60 md:h-60"
                >
                  <Image
                    src="/images/Landing_Page/LogoOnly.png"
                    alt="SUBLIS Theme Logo"
                    fill
                    className="object-contain drop-shadow-[0_0_25px_rgba(56,189,248,0.6)]"
                  />
                </motion.div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-4 border-4 border-dashed border-sky-300/40 rounded-full"
                />
              </motion.div>

              <p className="text-[11px] uppercase tracking-[0.3em] text-sky-300 font-semibold text-center relative z-10">
                LOGO
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        /* headline closer to your reference */
        .hero-title {
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
          background: linear-gradient(to bottom, #ffffff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
        }

        .hero-line {
          height: 2px;
          width: 100px;
          background: #e62b1e;
          margin: 0 auto;
          box-shadow: 0 0 20px rgba(230, 43, 30, 0.5);
        }
        .heroWhite {
          color: rgba(255, 255, 255, 0.95);
          -webkit-text-stroke: 2px rgba(0, 0, 0, 0.35);
          text-shadow: 0 3px 0 rgba(0, 0, 0, 0.35);
        }
        .heroRed {
          color: #eb0028;
          -webkit-text-stroke: 2px rgba(0, 0, 0, 0.35);
          text-shadow: 0 3px 0 rgba(0, 0, 0, 0.35);
          margin: 0 0.08em;
        }

        /* tap layout */
        .tapWrap {
          position: relative;
          display: inline-block;
          width: 1.07em;
          height: 1.15em;
          margin-left: 0.02em;
          transform: translateY(0.05em); /* match baseline like ref */
        }
        .tapSpace {
          color: rgba(255, 255, 255, 0); /* reserves exact slot */
          -webkit-text-stroke: 0px transparent;
          text-shadow: none;
        }
        .tapSvgWrap {
          position: absolute;
          inset: -0.06em;
        }
        .tapGlyph {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* spout anchor (tuned to the spout bump position) */
        .tapAnchor {
          position: absolute;
          left: 88%;
          top: 61%;
          width: 10px;
          height: 10px;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
  );
}
