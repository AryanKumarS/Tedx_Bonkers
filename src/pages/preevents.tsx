"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import Hyperspeed from "@/components/HyperSpeed/Hyperspeed";
import Image from "next/image";
import Footer from "@/components/Footer/Footer";

interface Event {
  id: number;
  title: string;
  description: string;
  images: string[];
}

interface FogBlob {
  xOff: number;
  yOff: number;
  radius: number;
  opacity: number;
}

interface FogParticle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  opacity: number;
  blobs: FogBlob[];
}

const MemoHyperspeed = React.memo(Hyperspeed);

const TedxRippleWebsite = () => {
  const rippleBgRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [,setShowUI] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [introDismissed, setIntroDismissed] = useState(false);
  const lastInteractionRef = useRef<number>(Date.now());

  const RippleLayer = React.useMemo(
    () => (
      <div
        ref={rippleBgRef}
        className="absolute inset-0 z-20 pointer-events-auto bg-image-responsive"
        style={{
          backgroundImage: "url('/preevents/tpe.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    ),
    [],
  );

  const preloadImages = (images: string[]) => {
    images.forEach((src) => {
      const img = new window.Image();

      img.src = src;
    });
  };

  // Hero scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -30]);

  const events: Event[] = [
    {
      id: 1,
      title: "PIERCING THE VEIL",
      description:
        "Our theme reveal event, built excitement through games and shared anticipation leading up to the moment everyone was waiting for. The unveiling of SUBLIS.",
      images: [
        "/preevents/themrev/DSC_0676.webp",
        "/preevents/themrev/DSC01336.webp",
        "/preevents/themrev/DSC01269.webp",
      ],
    },
    {
      id: 2,
      title: "LUMIÈRE",
      description:
        "In early October, TEDx NIIT University unveiled Lumière, a vibrant festival of light, art, games, interactive stalls, laughter, creativity, and wonder everywhere.",
      images: [
        "/preevents/lumiere/DSC05830.jpg",
        "/preevents/lumiere/DSC05855.webp",
        "/preevents/lumiere/DSC05838.webp",
      ],
    },
    {
      id: 3,
      title: "UNMUTE",
      description:
        "Unmute, our interactive awareness session led by Ms. Harleen Kaur Chadda, encouraged open dialogue on mental well-being empowered participants",
      images: [
        "/preevents/unmute/IMG_8770.JPG",
        "/preevents/unmute/DSC_0723.webp",
        "/preevents/unmute/DSC_0569.webp",
      ],
    },
    // {
    //   id: 4,
    //   title: "UNDERCURRENT",
    //   description:
    //     "Meet the distinguished speakers and panelists who will share their insights and experiences.",
    //   images: [
    //     "https://picsum.photos/seed/panel1/1600/900",
    //     "https://picsum.photos/seed/panel2/1600/900",
    //     "https://picsum.photos/seed/panel3/1600/900",
    //   ],
    // },
    {
      id: 5,
      title: "ADVENTURE DAY",
      description:
        "Undercurrent was the event where we unveiled the speakers of TEDxNIIT University. It offered the first look at the voices and stories that will bring the theme to life on the main stage.",
      images: [
        "/preevents/aday/aday3.jpg",
        "/preevents/aday/aday2.jpg",
        "/preevents/aday/aday1.jpg",
      ],
    },
  ];

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
    if (!rippleBgRef.current) return;
    if (!(window as any).WebGLRenderingContext) return;

    let $: any;

    const initRipples = async () => {
      const jquery = await import("jquery");
      $ = jquery.default;

      (window as any).jQuery = $;
      (window as any).$ = $;

      await import("jquery.ripples");

      $(rippleBgRef.current).ripples({
        resolution: 512,
        dropRadius: 25,
        perturbance: 0.04,
        interactive: true,
      });
    };

    initRipples();

    return () => {
      if ($ && rippleBgRef.current) {
        try {
          $(rippleBgRef.current).ripples("destroy");
        } catch {}
      }
    };
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section
        ref={heroRef}
        id="hero"
        className="hero-section"
        style={{
          height: "calc(var(--vh, 1vh) * 105)",
          backgroundColor: "#000000",
        }}
      >
        {/* Hyperspeed Background */}
        <div className="absolute inset-0 z-0" style={{ opacity: 1 }}>
          <MemoHyperspeed />
        </div>

        <motion.div
          className="hero-content relative z-10"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {"PRE EVENTS".split("").map((letter, i) => (
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

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            Relive the moments that inspired change
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

      {/* EVENTS SECTION */}
      <div
        id="events-section"
        className="relative w-full min-h-screen bg-black"
      >
        {/* CLICK + RIPPLE LAYER */}
        <div
          className="absolute inset-0 z-30"
          onClick={(e) => {
            lastInteractionRef.current = Date.now();

            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if ((window as any).$ && rippleBgRef.current) {
              requestAnimationFrame(() => {
                (window as any)
                  .$(rippleBgRef.current)
                  .ripples("drop", x, y, 55, 0.09);
              });
            }

            // If no active event, start with the first one
            if (!activeEvent) {
              setActiveEvent(events[0]);
              requestAnimationFrame(() => {
                preloadImages(events[0].images);
              });
              setClickCount(0);
            } else {
              // Otherwise cycle through events
              const nextIndex = (clickCount + 1) % events.length;
              setActiveEvent(events[nextIndex]);

              requestAnimationFrame(() => {
                preloadImages(events[nextIndex].images);
              });
              setClickCount((c) => c + 1);
            }
          }}
        >
          {RippleLayer}
        </div>

        <AnimatePresence initial={false} mode="sync">
          {!activeEvent ? (
            <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
              <motion.div
                key="click-to-reveal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h2
                  className="text-4xl md:text-7xl font-bold text-white tracking-wider"
                  style={{ fontFamily: "Google Sans Flex, sans-serif" }}
                >
                  CLICK TO REVEAL
                </h2>
              </motion.div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
              <motion.div
                key={activeEvent.id}
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{
                  opacity: { duration: 0.25, ease: "easeInOut" },
                  y: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }, // Material ease-in-out
                }}
                className="pointer-events-auto"
              >
                <div
                  className="text-center max-w-4xl mx-4"
                  style={{ fontFamily: "Google Sans Flex, sans-serif" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-8">
                    {activeEvent.title}
                  </h2>

                  <p className="text-base md:text-2xl text-gray-200 leading-relaxed mb-10 md:mb-14">
                    {activeEvent.description}
                  </p>

                  <div className="flex flex-row justify-center gap-5 md:gap-8 mt-2 md:mt-4 flex-wrap">
                    {activeEvent.images.map((imgSrc, index) => (
                      <div
                        key={index}
                        className="relative w-[36vw] md:w-[280px] h-[120px] md:h-[180px] rounded-xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer border border-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex(index);
                        }}
                      >
                        <Image
                          src={imgSrc}
                          alt={`Event image ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 36vw, 280px"
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Hover Dock Navigation – anchored to background */}
        <div
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-40 pointer-events-auto max-w-[95vw] md:max-w-max"
          style={{ fontFamily: "Google Sans Flex, sans-serif" }}
        >
          <div className="flex flex-row items-center gap-2 p-2 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-x-auto custom-scrollbar">
            {events.map((event) => {
              const isActive = activeEvent?.id === event.id;
              return (
                <button
                  key={event.id}
                  onClick={() => {
                    lastInteractionRef.current = Date.now();
                    setActiveEvent(event);

                    if ((window as any).$ && rippleBgRef.current) {
                      const rect = rippleBgRef.current.getBoundingClientRect();
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;

                      requestAnimationFrame(() => {
                        (window as any)
                          .$(rippleBgRef.current)
                          .ripples("drop", centerX, centerY, 60, 0.1);
                      });
                    }
                  }}
                  className={`
            relative px-4 py-2 md:px-6 md:py-3 rounded-xl text-xs md:text-sm font-medium tracking-wide transition-all duration-300 whitespace-nowrap flex-shrink-0
            ${
              isActive
                ? "bg-white text-black shadow-lg scale-105"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }
          `}
                >
                  {event.title}
                </button>
              );
            })}
          </div>
        </div>

        <style>{`
                .click-reveal-bg {
                    background: url('/images/test/tpe.png') center center/cover no-repeat;
                }
                @media (max-width: 600px) {
                  .bg-image-responsive {
                    background-size: contain !important;
                    background-position: top center !important;
                    min-height: 350px !important;
                  }
                }
            `}</style>

        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out forwards;
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        .animate-fadeOut {
          animation: fadeOut 0.4s ease-in forwards;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 2s infinite;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .custom-scrollbar::-webkit-scrollbar {
            height: 4px; /* Horizontal scrollbar height */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }
      `}</style>

        {/* Image Carousel Modal */}
        {selectedImageIndex !== null && activeEvent && (
          <div
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            style={{ animationDuration: "0.3s" }}
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Navigation - Prev */}
            <button
              className={`absolute left-4 md:left-12 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all ${selectedImageIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : prev,
                );
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Main Image */}
            <div
              className="relative w-full h-full max-w-[95vw] md:max-w-[75vw] max-h-[75vh] flex items-center justify-center pointer-events-none select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                key={selectedImageIndex} // Force re-mount for animation
                src={activeEvent?.images[selectedImageIndex]}
                alt="Event gallery"
                className="w-full h-full object-contain rounded-lg shadow-2xl animate-fadeIn"
                style={{ animationDuration: "0.4s" }}
              />
            </div>

            {/* Navigation - Next */}
            <button
              className={`absolute right-4 md:right-12 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all ${selectedImageIndex === (activeEvent?.images.length ?? 0) - 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              onClick={(e) => {
                e.stopPropagation();
                const imagesLength = activeEvent?.images.length ?? 0;
                setSelectedImageIndex((prev) =>
                  prev !== null && prev < imagesLength - 1 ? prev + 1 : prev,
                );
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-medium">
              {selectedImageIndex + 1} / {activeEvent?.images.length}
            </div>
          </div>
        )}
      </div>

      {/* STYLES */}
      <style>{`
                .hero-section {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .hero-content {
                    text-align: center;
                    padding: 0 2rem;
                    max-width: 1200px;
                }

                .hero-title {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    font-size: clamp(3rem, 8vw, 6rem);
                    font-weight: 900;
                    letter-spacing: -0.02em;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(to bottom, #ffffff, #e0e0e0);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .title-letter {
                    display: inline-block;
                }

                .hero-subtitle {
                    font-size: clamp(1rem, 2vw, 1.5rem);
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 2rem;
                    font-weight: 300;
                }

                .hero-line {
                    height: 2px;
                    width: 100px;
                    background: #e62b1e;
                    margin: 0 auto;
                    box-shadow: 0 0 20px rgba(230, 43, 30, 0.5);
                }

                .scroll-indicator-wrapper {
                    position: absolute;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .scroll-indicator {
                    position: relative;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 1rem;
                }

                .scroll-ring {
                    position: absolute;
                    inset: 0;
                    border: 2px solid rgba(230, 43, 30, 0.3);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .scroll-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    color: rgba(255, 255, 255, 0.6);
                }

                .scroll-mouse {
                    width: 24px;
                    height: 36px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 12px;
                    display: flex;
                    justify-content: center;
                    padding-top: 6px;
                }

                .scroll-wheel {
                    width: 3px;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 2px;
                }

                .scroll-text {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
            `}</style>
      <Footer />
    </>
  );
};

export default TedxRippleWebsite;
