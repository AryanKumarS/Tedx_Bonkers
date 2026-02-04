"use client";
import { MetalButton } from "@/components/ui/metal-button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FluidGlass from "@/components/FluidGlass/FluidGlass";
import { scrollSync } from "@/lib/scrollStore";
gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const ModelViewer = dynamic(() => import("@/components/client/ModelViewer"), {
  ssr: false,
});

export default function Home() {
  const textWrapRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const modelViewerRef = useRef<HTMLDivElement>(null);
  const sponsorsSectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!textWrapRef.current || !spacerRef.current) return;

    const PHASE_START = 0.2;

    const debounce = (func: () => void, wait: number) => {
      let timeout: NodeJS.Timeout | null = null;
      return () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(func, wait);
      };
    };

    const getViewportHeight = () => {
      if (typeof window === "undefined") return 0;

      // Use visualViewport for accurate mobile viewport (accounts for address bar)
      if (window.visualViewport) {
        return window.visualViewport.height;
      }

      // Fallback to innerHeight, but prefer the larger value for mobile
      // This ensures content isn't cut off when address bar is visible
      const innerHeight = window.innerHeight;
      const clientHeight = document.documentElement.clientHeight;

      // On mobile, use the larger value to account for address bar hiding
      if (window.innerWidth < 768) {
        return Math.max(innerHeight, clientHeight);
      }

      return innerHeight;
    };

    const getViewportWidth = () => {
      if (typeof window === "undefined") return 0;

      if (window.visualViewport) {
        return window.visualViewport.width;
      }

      return window.innerWidth;
    };

    const getDeviceType = () => {
      if (typeof window === "undefined") return "desktop";

      const width = getViewportWidth();
      const height = getViewportHeight();
      const aspectRatio = width / height;

      if (width < 768) {
        return "mobile";
      }

      if (width >= 768 && width < 1024) {
        return "tablet";
      }

      if (width >= 1920 && aspectRatio > 2) {
        return "ultrawide";
      }

      return "desktop";
    };

    const calculateScrollMetrics = () => {
      const sections = Array.from(
        textWrapRef.current?.querySelectorAll("section") || [],
      ) as HTMLElement[];

      sectionsRef.current = sections;

      if (sections.length === 0) return null;

      const vh = getViewportHeight();
      const deviceType = getDeviceType();

      const contentSections = sections.slice(1);
      const sectionCount = contentSections.length;

      // Calculate actual section heights to ensure all content is visible
      let totalActualHeight = 0;
      let maxSectionHeight = 0;

      contentSections.forEach((section) => {
        // Force a layout calculation to get actual height
        const rect = section.getBoundingClientRect();
        const sectionHeight = Math.max(rect.height, vh);
        totalActualHeight += sectionHeight;
        maxSectionHeight = Math.max(maxSectionHeight, sectionHeight);
      });

      // Use actual heights if available, otherwise fall back to viewport-based calculation
      let minSectionHeight = vh;

      if (vh > 1200) {
        minSectionHeight = Math.min(vh, 1200);
      }

      if (vh < 500) {
        minSectionHeight = Math.max(vh, 500);
      }

      // Use the larger of actual height or calculated height to ensure all content is visible
      const calculatedTotalShift = sectionCount * minSectionHeight;
      const baseTotalShift = Math.max(totalActualHeight, calculatedTotalShift);

      // For logo section (last section), position it in bottom half of screen when fully visible
      // Add a shift to ensure it scrolls into view in the bottom portion (not centered)
      // This positions it in the lower half of the screen with space at bottom
      const logoSectionBottomShift = vh * 0.4; // Position in bottom half, moving up a bit more
      const totalShift = baseTotalShift + logoSectionBottomShift;

      let scrollMultiplier = 3;

      switch (deviceType) {
        case "mobile":
          scrollMultiplier = vh < 600 ? 5.5 : 5;
          break;
        case "tablet":
          scrollMultiplier = 4.5;
          break;
        case "ultrawide":
          scrollMultiplier = 3;
          break;
        case "desktop":
        default:
          scrollMultiplier = vh > 1000 ? 3 : 3.5;
          break;
      }

      const effectiveScrollRange = totalShift / (1 - PHASE_START);
      const calculatedScrollDistance =
        effectiveScrollRange + vh * scrollMultiplier;
      const minScrollDistance = totalShift / (1 - PHASE_START) + vh * 4;

      // Add extra padding to ensure smooth scrolling and sponsors section can be centered
      const extraPadding =
        deviceType === "mobile"
          ? vh * 4 // Increased to allow full scroll to center
          : vh * 2.5; // Increased to allow full scroll to center
      const scrollDistance =
        Math.max(minScrollDistance, calculatedScrollDistance) + extraPadding;

      return { totalShift, scrollDistance, vh, deviceType };
    };

    let scrollTriggerInstance: ScrollTrigger | null = null;
    let animationContext: gsap.Context | null = null;

    const setupScrollTrigger = () => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
        scrollTriggerInstance = null;
      }

      if (animationContext) {
        animationContext.revert();
        animationContext = null;
      }

      const metrics = calculateScrollMetrics();
      if (!metrics) return null;

      const { totalShift, scrollDistance } = metrics;

      if (spacerRef.current) {
        // Ensure spacer has minimum height and uses calculated scroll distance
        spacerRef.current.style.height = `${scrollDistance}px`;
        spacerRef.current.style.minHeight = `${scrollDistance}px`;
        spacerRef.current.style.display = "block";
        spacerRef.current.style.width = "100%";
      }

      animationContext = gsap.context(() => {
        const setY = gsap.quickSetter(textWrapRef.current, "y", "px");
        const currentDeviceType = getDeviceType();
        const isMobile = currentDeviceType === "mobile";

        // Calculate when logo section has fully arrived
        // Logo section is now the last content section (index 5 in contentSections, index 6 in all sections)
        const contentSections = sectionsRef.current.slice(1); // Skip first empty section
        const logoSectionIndex = 5; // Last content section (0-indexed: Speakers=0, Pre-Events=1, Rewind=2, About=3, Sponsors=4, Logo=5)
        const sectionCount = contentSections.length;

        // Calculate scroll progress when logo section has fully arrived
        const logoSectionEndContentProgress =
          (logoSectionIndex + 1) / sectionCount;
        const logoSectionEndScrollProgress =
          PHASE_START + logoSectionEndContentProgress * (1 - PHASE_START);

        scrollTriggerInstance = ScrollTrigger.create({
          trigger: spacerRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          refreshPriority: -1,

          onUpdate: (self) => {
            const scrollProgress = self.progress;

            // Calculate content progress
            const contentProgress = Math.max(
              (scrollProgress - PHASE_START) / (1 - PHASE_START),
              0,
            );
            const clampedContentProgress = Math.min(contentProgress, 1);

            scrollSync.rawProgress = scrollProgress;
            scrollSync.progress = Math.min(contentProgress, 1); // Keep progress at max 1 for other components

            setY(-totalShift * clampedContentProgress);

            if (isMobile && modelViewerRef.current) {
              const logoSectionStartContentProgress =
                logoSectionIndex / sectionCount;
              const logoSectionStartScrollProgress =
                PHASE_START +
                logoSectionStartContentProgress * (1 - PHASE_START);

              if (scrollProgress >= logoSectionStartScrollProgress) {
                const logoSectionProgress = Math.min(
                  (scrollProgress - logoSectionStartScrollProgress) /
                    (logoSectionEndScrollProgress -
                      logoSectionStartScrollProgress),
                  1,
                );

                const vh = getViewportHeight();
                const logoTopOffset = vh * 0.5;
                const logoYPosition = -logoTopOffset * logoSectionProgress;
              } else {
                gsap.set(modelViewerRef.current, {
                  y: 0,
                });
              }
            }
          },
        });
      });

      return animationContext;
    };

    let ctx = setupScrollTrigger();

    const refreshScrollTrigger = () => {
      requestAnimationFrame(() => {
        const newCtx = setupScrollTrigger();
        if (newCtx && ctx) {
          ctx.revert();
          ctx = newCtx;
        }
      });
    };

    const debouncedRefresh = debounce(refreshScrollTrigger, 150);

    const handleResize = () => {
      debouncedRefresh();
    };

    const handleVisualViewportResize = () => {
      // Debounce visual viewport resize to avoid excessive recalculations
      debouncedRefresh();
    };

    // Handle content changes that might affect section heights
    let contentObserver: MutationObserver | null = null;

    if (textWrapRef.current) {
      contentObserver = new MutationObserver(() => {
        debouncedRefresh();
      });

      contentObserver.observe(textWrapRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });
    }

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize);

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        handleVisualViewportResize,
        { passive: true },
      );
    }

    // Initial refresh with multiple attempts to handle dynamic content loading
    const initialRefreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
      // Second refresh after a longer delay to catch any late-loading content
      setTimeout(() => {
        refreshScrollTrigger();
        ScrollTrigger.refresh();
      }, 500);
    }, 100);

    return () => {
      clearTimeout(initialRefreshTimeout);
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
        scrollTriggerInstance = null;
      }
      if (animationContext) {
        animationContext.revert();
        animationContext = null;
      }
      if (ctx) {
        ctx.revert();
      }
      if (contentObserver) {
        contentObserver.disconnect();
        contentObserver = null;
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleVisualViewportResize,
        );
      }
    };
  }, []);

  return (
    <main className="relative w-full bg-black">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div ref={modelViewerRef} className="w-full h-full">
          <ModelViewer url="" />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 50%, rgba(0, 0, 0, 0.1) 80%, rgba(0, 0, 0, 0.3) 100%)",
          }}
        />
      </div>

      <div
        ref={textWrapRef}
        className="fixed inset-0 z-20 pointer-events-none will-change-transform md:mr-40"
      >
        <section className="min-h-screen flex items-center justify-center" />

        <section className="min-h-screen flex items-center justify-center pointer-events-auto px-6 md:px-12">
          <div className="max-w-xl mx-auto md:ml-auto md:mr-0 text-center">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-4xl md:text-7xl font-bold text-white text-glow">
                Speakers
              </h2>
              <div className="w-36 h-[1px] bg-[#D3D3D3] shadow-[0_0_10px_rgba(230,230,230,230)]" />
              <p className="text-center text-base md:text-[1.6rem] leading-[1.7] max-w-[28.75rem] mx-auto font-medium font-sans tracking-[0.02em] text-[#EAEAEA] mt-4 px-4 md:px-0">
                From bold ideas to lived experiences, our speakers embody
                curiosity, resilience, and innovation. Their stories invite you
                to question, reflect, and see the world through a new lens.
                Together, they bring perspectives that spark dialogue, challenge
                assumptions, and leave a lasting impact beyond the stage.
              </p>
              <div className="mt-2">
                <Link href="/speakers" passHref legacyBehavior>
                  <a tabIndex={0}>
                    <MetalButton variant="purple" className="text-sm">
                      Learn More
                    </MetalButton>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="min-h-screen flex items-center pointer-events-auto px-6 md:px-12">
          <div className="max-w-xl mx-auto md:ml-auto md:mr-0 text-center">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-4xl md:text-7xl font-bold text-white text-glow">
                Pre-Events
              </h2>
              <div className="w-48 h-[1px] bg-[#D3D3D3] shadow-[0_0_10px_rgba(230,230,230,230)]" />
              <p className="text-center text-base md:text-[1.6rem] leading-[1.7] max-w-[28.75rem] mx-auto font-medium font-sans tracking-[0.02em] text-[#EAEAEA] mt-4 px-4 md:px-0">
                A series of thoughtfully curated moments that built the momentum
                toward the main stage. From reveals and conversations to
                celebration and connection, each pre-event shaped the journey.
                Together, these five chapters led us to the event itself.
              </p>
              <div className="mt-2">
                <Link href="/preevents" passHref legacyBehavior>
                  <a tabIndex={0}>
                    <MetalButton variant="purple" className="text-sm">
                      Learn More
                    </MetalButton>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="min-h-screen flex items-center pointer-events-auto px-6 md:px-12">
          <div className="max-w-xl mx-auto md:ml-auto md:mr-0 text-center">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-4xl md:text-7xl font-bold text-white text-glow">
                Rewind
              </h2>
              <div className="w-24 h-[1px] bg-[#D3D3D3] shadow-[0_0_10px_rgba(230,230,230,230)]" />
              <p className="text-center text-base md:text-[1.6rem] leading-[1.7] max-w-[28.75rem] mx-auto font-medium font-sans tracking-[0.02em] text-[#EAEAEA] mt-4 px-4 md:px-0">
                A journey through the moments and ideas that defined our past
                editions. As we mark our 9th year, it reflects the legacy built
                over time and the stories that continue to inspire. Each chapter
                reminds us how far we’ve come and sets the tone for what lies
                ahead.
              </p>
              <div className="mt-2">
                <Link href="/rewind" passHref legacyBehavior>
                  <a tabIndex={0}>
                    <MetalButton variant="purple" className="text-sm">
                      Learn More
                    </MetalButton>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="min-h-screen flex items-center pointer-events-auto px-6 md:px-12 py-8 md:py-0">
          <div className="max-w-xl mx-auto md:ml-auto md:mr-0 text-center">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-4xl md:text-7xl font-bold text-white text-glow">
                About
              </h2>
              <div className="w-24 h-[1px] bg-[#D3D3D3] shadow-[0_0_10px_rgba(230,230,230,230)]" />
              <p className="text-center text-base md:text-[1.6rem] leading-[1.7] max-w-[30rem] mx-auto font-sans font-medium tracking-[0.02em] text-[#EAEAEA] mt-4 px-4 md:px-0">
                TEDx is a global movement dedicated to sharing ideas that
                matter. <br />
                TEDxNIIT University is an independently organized event driven
                by a passionate team committed to creating a platform where
                ideas, innovation, and dialogue thrive within our community.
              </p>
              <div className="mt-2">
                <Link href="/about" passHref legacyBehavior>
                  <a tabIndex={0}>
                    <MetalButton variant="purple" className="text-sm">
                      Learn More
                    </MetalButton>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="min-h-screen flex items-end md:items-center pointer-events-auto px-6 md:px-12 py-8 md:py-0">
          <div className="max-w-xl mx-auto md:ml-auto md:mr-0 text-center mb-24 md:mb-0">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-[1px] bg-[#D3D3D3] shadow-[0_0_10px_rgba(230,230,230,230)]" />
              <p className="text-center text-base md:text-[1.6rem] leading-[1.7] max-w-[30rem] mx-auto font-medium font-sans tracking-[0.02em] text-[#EAEAEA] mt-4 px-4 md:px-0">
                The logo embodies Sublis through a fluid droplet that reveals
                motion within, symbolizing forces often unnoticed yet deeply
                influential. The wheel inside reflects continuous movement,
                ideas in flow, reminding us that what moves beneath ultimately
                moves us all.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div
        ref={spacerRef}
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "block",
        }}
      />
      <FluidGlass />
    </main>
  );
}
