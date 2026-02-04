"use client";

import React, { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface VinylRecordProps {
  coverSrc: string | StaticImageData;
  backCoverSrc?: string | StaticImageData;
  labelSrc?: string | StaticImageData;
  isPlaying?: boolean;
  centerColor?: string;
  discSide?: "left" | "right";
}

const VinylRecord: React.FC<VinylRecordProps> = ({
  coverSrc,
  backCoverSrc,
  labelSrc,
  isPlaying = true,
  centerColor = "#c3c3c3",
  discSide = "right",
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const flipContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(flipContainerRef.current, {
      rotationY: isFlipped ? 180 : 0,
      duration: 0.8,
      ease: "power2.inOut",
    });
  }, [isFlipped]);

  // Determine alignment classes based on discSide
  const marginClass = discSide === "right"
    ? "mr-16 md:mr-40 lg:mr-60"
    : "ml-16 md:ml-40 lg:ml-60";

  const discPositionClass = discSide === "right"
    ? "left-[50%]"
    : "right-[50%] left-auto";

  return (
    <div className={`relative flex items-center justify-center p-4 md:p-12 ${marginClass}`}>
      <style jsx>{`
        @keyframes spin-record {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .record-spinning {
          animation: spin-record 3s linear infinite;
        }
        .perspective-container {
          perspective: 1000px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          /* GSAP handles transition */
          transform-style: preserve-3d;
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 0.375rem; /* rounded-md */
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* THE VINYL DISC
         - Responsive sizes: w-60 h-60 (mobile) -> md:w-80 md:h-80 -> lg:w-[30rem] lg:h-[30rem]
         - Position adjusted by discSide prop
      */}
      <div
        className={`
          absolute w-60 h-60 md:w-80 md:h-80 lg:w-[30rem] lg:h-[30rem] rounded-full shadow-xl z-0 ${discPositionClass}
          flex items-center justify-center
          ${isPlaying ? "record-spinning" : ""}
        `}
        style={{
          background: `
            repeating-radial-gradient(#111 0, #111 2px, #282828 3px, #282828 4px),
            conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.1) 90deg, transparent 180deg, rgba(255,255,255,0.1) 270deg, transparent 360deg)
          `,
          backgroundBlendMode: 'overlay'
        }}
      >
        {/* Center Label - Responsive scaling */}
        <div
          className="relative h-16 w-16 md:h-24 md:w-24 lg:h-32 lg:w-32 overflow-hidden rounded-full border-4 border-black flex items-center justify-center"
          style={{ backgroundColor: centerColor }}
        >
          {labelSrc ? (
            <Image
              src={labelSrc}
              alt="Record Label"
              fill
              className="object-cover"
            />
          ) : (
            <div className="relative h-full w-full" style={{ backgroundColor: centerColor }}>
              <div className="absolute top-0 h-1/2 w-full bg-black/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[0.6rem] md:text-xs font-bold tracking-widest text-black/70">
                  SIDE A
                </span>
              </div>
              <div className="absolute bottom-4 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-black/20" />
            </div>
          )}
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black z-20" />
        </div>
      </div>

      {/* THE ALBUM COVER */}
      <div
        className="relative z-10 w-60 h-60 md:w-80 md:h-80 lg:w-[30rem] lg:h-[30rem] cursor-pointer perspective-container"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div ref={flipContainerRef} className="flip-card-inner shadow-2xl rounded-md">
          {/* FRONT */}
          <div className="flip-card-front">
            <Image
              src={coverSrc}
              alt="Album Cover Front"
              fill
              className="rounded-md object-cover"
              sizes="500px"
              priority
            />
            <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
          </div>

          {/* BACK */}
          <div className="flip-card-back bg-white relative">
            {backCoverSrc ? (
              <Image
                src={backCoverSrc}
                alt="Album Cover Back"
                fill
                className="rounded-md object-cover"
                sizes="500px"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 rounded-md flex items-center justify-center text-white/50">
                No Back Cover
              </div>
            )}
            <div className="absolute inset-0 rounded-md bg-black/5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VinylRecord;