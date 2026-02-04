"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { ChevronDown, Search, Filter, ArrowUp, Users } from "lucide-react";
import Hyperspeed from "@/components/HyperSpeed/Hyperspeed";
import { SpeakerModal } from "@/components/SpeakerModal/SpeakerModal";
import { SpeakerCard } from "@/components/SpeakerCard/SpeakerCard";
import { speakers, categories, type Speaker } from "@/data/speakers";
import { SpeakersStyles } from "@/styles/speakers.styles";
import FloatingLines from "@/components/FloatingLines/FloatingLines";

/* ================== HOOKS ================== */

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/* ================== BACKGROUND ================== */

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      })),
    [],
  );

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
function FloatingOrbs() {
  return (
    <div className="orbs-container">
      <motion.div
        className="orb orb-1"
        animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-2"
        animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 0.8, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-3"
        animate={{ x: [0, 60, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function GridBackground() {
  return (
    <div className="grid-bg">
      <div className="grid-overlay" />
      <motion.div
        className="grid-glow"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ================== SEARCH ================== */

function SearchModal({
  isOpen,
  onClose,
  speakers,
  onSelectSpeaker,
}: {
  isOpen: boolean;
  onClose: () => void;
  speakers: Speaker[];
  onSelectSpeaker: (speaker: Speaker) => void;
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 200);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSpeakers = useMemo(() => {
    if (!debouncedQuery) return speakers.slice(0, 5);
    const q = debouncedQuery.toLowerCase();
    return speakers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.topic.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
  }, [debouncedQuery, speakers]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="search-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="search-modal"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search speakers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="search-kbd">ESC</kbd>
        </div>

        <div className="search-results">
          {filteredSpeakers.length === 0 ? (
            <div className="search-empty">No speakers found</div>
          ) : (
            filteredSpeakers.map((speaker) => (
              <button
                key={speaker.id}
                className="search-result-item"
                onClick={() => {
                  onSelectSpeaker(speaker);
                  onClose();
                }}
              >
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  loading="lazy"
                  decoding="async"
                />

                <div className="search-result-info">
                  <span className="search-result-name">{speaker.name}</span>
                  <span className="search-result-topic">{speaker.topic}</span>
                </div>
                <span className="search-result-category">
                  {speaker.category}
                </span>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================== FILTER ================== */

function FilterPills({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <div className="filter-container">
      <div className="filter-label">
        <Filter size={16} />
        <span>Filter</span>
      </div>
      <div className="filter-pills">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-pill ${activeCategory === category ? "filter-pill-active" : ""}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================== BACK TO TOP ================== */

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ================== MAIN PAGE ================== */

export default function SpeakersPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Speaker | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -30]);

  const filteredSpeakers = useMemo(() => {
    if (activeCategory === "All") return speakers;
    return speakers.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    let timeout: any;

    const onScroll = () => {
      document.body.classList.add("is-scrolling");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 150);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <a href="#speakers-section" className="skip-link">
        Skip to speakers
      </a>

      <div className="fixed-background">
        <GridBackground />
        <ParticleField />
        <FloatingOrbs />
      </div>

      {/* HERO */}
      <section
        ref={heroRef}
        id="hero"
        className="hero-section"
        style={{ height: "101vh", backgroundColor: "#000000" }}
      >
        {/* FloatingLines Background */}
        <div className="absolute inset-0 z-0">
          <FloatingLines
            linesGradient={[
              "#1a0000",
              "#4a0000",
              "#e62b1e",
              "#4a0000",
              "#1a0000",
            ]}
            enabledWaves={["middle", "bottom"]}
            lineCount={[8, 6]}
            lineDistance={[8, 10]}
            topWavePosition={{ x: 10.0, y: 0.5, rotate: -0.4 }}
            middleWavePosition={{ x: 5.0, y: 0.0, rotate: 0.2 }}
            bottomWavePosition={{ x: 2.0, y: -0.7, rotate: -1 }}
            animationSpeed={0.5}
            interactive={true}
            bendRadius={3.0}
            bendStrength={-0.3}
            parallax={true}
            parallaxStrength={0.15}
            mixBlendMode="screen"
          />
        </div>

        <motion.div
          className="hero-content relative z-10"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <motion.h1
            className="hero-title responsive-hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* On mobile, break after 'Meet Our' */}
            <span className="block md:inline">{[...'Meet Our '].map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + i * 0.02,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="title-letter"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}</span>
            <span className="block md:inline">{[...'Speakers'].map((letter, i) => (
              <motion.span
                key={i + 9}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + (i + 9) * 0.02,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="title-letter"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            Brilliant minds sharing ideas worth spreading
          </motion.p>

          <motion.div
            className="hero-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.7, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* Border */}
      <div className="relative w-full" style={{ zIndex: 10 }}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="w-full h-[2px] bg-red-600 mb-6"
          style={{ boxShadow: "0 0 10px rgba(230, 43, 30, 0.6)" }}
        />
      </div>

      {/* ALL SPEAKERS */}
      <section id="speakers-section" className="speakers-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title text-5xl">THE LINEUP</h2>
          <div className="section-line" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="speakers-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredSpeakers.map((speaker, index) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                onClick={() => setActive(speaker)}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      <AnimatePresence mode="wait">
        {active && (
          <SpeakerModal speaker={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence></AnimatePresence>
      <BackToTop />
      <SpeakersStyles />
      <style jsx global>{`
        .responsive-hero-title {
          font-size: 2.5rem;
        }
        @media (max-width: 640px) {
          .responsive-hero-title {
            font-size: 2.8rem;
            line-height: 1.1;
            text-align: center;
          }
          .responsive-hero-title span.block {
            display: block;
          }
        }
        @media (max-width: 420px) {
          .responsive-hero-title {
            font-size: 2.1rem;
          }
        }
      `}</style>
      <Footer />
    </>
  );
}
import Footer from "@/components/Footer/Footer";
