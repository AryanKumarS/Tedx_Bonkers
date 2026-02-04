import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

type Speaker = {
  id: number;
  name: string;
  role: string;
  topic: string;
  category: string;
  bio: string;
  image: string;
  linkedin: string;
  twitter: string;
  featured?: boolean;
};

interface SpeakerCardProps {
  speaker: Speaker;
  onClick: () => void;
  index: number;
}

/* ================== HOOKS ================== */

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

function use3DEffect(ref: React.RefObject<HTMLDivElement | null>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 400,
    damping: 35,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 400,
    damping: 35,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
      y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
    };

    const handleLeave = () => {
      x.set(0);
      y.set(0);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref, x, y]);

  return { rotateX, rotateY };
}

function useGlare(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty(
        "--gx",
        `${((e.clientX - r.left) / r.width) * 100}%`,
      );
      el.style.setProperty(
        "--gy",
        `${((e.clientY - r.top) / r.height) * 100}%`,
      );
    };

    const handleLeave = () => {
      el.style.setProperty("--gx", "50%");
      el.style.setProperty("--gy", "50%");
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref]);
}

/* ================== COMPONENT ================== */

export function SpeakerCard({ speaker, onClick, index }: SpeakerCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const { rotateX, rotateY } = isMobile
    ? { rotateX: 0, rotateY: 0 }
    : use3DEffect(ref);

  if (!isMobile) {
    useGlare(ref);
  }

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 60 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="speaker-card"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="card-glow" />
      <div className="card-glare" />
      <div className="scan-line" />

      <div className="card-image-container">
        <div className="image-overlay" />
        <Image
          ref={imgRef}
          src={speaker.image}
          alt={speaker.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={index < 4}
          className="card-image"
          style={{ objectFit: "cover" }}
        />

        <div className="holographic-overlay" />
        <div className="">{speaker.category}</div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <div className="status-indicator" />
          <span className="speaker-tag">SPEAKER</span>
        </div>

        <h3 className="speaker-name">{speaker.name}</h3>

        <div className="topic-container">
          <p className="speaker-topic">{speaker.topic}</p>
        </div>

        <motion.div
          className="view-more"
          animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        >
          <span>View Profile →</span>
        </motion.div>
      </div>

      <div className="corner-accent corner-tl" />
      <div className="corner-accent corner-tr" />
      <div className="corner-accent corner-bl" />
      <div className="corner-accent corner-br" />
    </motion.div>
  );
}
