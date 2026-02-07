import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Heart, Share2, Bookmark, Linkedin, Twitter } from "lucide-react";

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

interface SpeakerModalProps {
  speaker: Speaker;
  onClose: () => void;
}

export function SpeakerModal({ speaker, onClose }: SpeakerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="modal-overlay-fullscreen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "circOut" }}
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="modal-container-fullscreen"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 50, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        tabIndex={-1}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={32} strokeWidth={1.5} />
        </button>

        <div className="modal-inner-fullscreen">
          {/* Left: Image Side */}
          <div className="modal-image-side">
            <motion.div
              className="modal-image-wrapper"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <img
  src={speaker.image}
  alt={speaker.name}
  className={`modal-full-image ${
    speaker.name === "Rainy Varshney" ? "rainy-modal-image" : ""
  }`}
/>
            </motion.div>
          </div>

          {/* Right: Info Side */}
          <div className="modal-info-side">
            <div className="modal-info-scroll-box">
              <div className="modal-background-x">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Single sharp X outline with wider center angle */}
                  <path d="M10,0 L30,0 L50,40 L70,0 L90,0 L60,50 L90,100 L70,100 L50,60 L30,100 L10,100 L40,50 Z" />
                </svg>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="modal-eyebrow">SPEAKER PROFILE</span>
                <h2 className="modal-full-name">{speaker.name}</h2>
                <div className="modal-full-role">{speaker.role}</div>

                <div className="modal-divider" />

                <div className="modal-bio-section">
                  <h4 className="modal-section-label">Biography</h4>
                  <p className="modal-full-bio">{speaker.bio}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
