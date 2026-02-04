import Link from "next/link";
import { MetalButton } from "@/components/ui/metal-button";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

  const links = [
    { name: "Speakers", path: "/speakers" },
    { name: "Rewind", path: "/rewind" },
    { name: "Pre Events", path: "/preevents" },
    { name: "About", path: "/about" },
  ];

  useEffect(() => {
    if (dropdownRef.current && menuItemsRef.current) {
      if (isMenuOpen) {
        // Opening animation - upward from bottom
        gsap.fromTo(
          dropdownRef.current,
          {
            height: 0,
            opacity: 0,
            y: 20,
          },
          {
            height: "auto",
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
            delay: 0,
          },
        );

        // Stagger animation for menu items
        const items = menuItemsRef.current.children;
        gsap.fromTo(
          items,
          {
            opacity: 0,
            y: 10,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            stagger: 0.08,
            ease: "power2.out",
          },
        );
      } else {
        // Closing animation - downward
        gsap.to(dropdownRef.current, {
          height: 0,
          opacity: 0,
          y: 20,
          duration: 0.25,
          ease: "power2.in",
        });
      }
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[1000]">
      <div className="mt-3 max-h-[64px] max-w-6xl mx-auto px-4 md:px-8 py-2.5 flex items-center border border-white/20 border-t-white/40 border-l-white/30 backdrop-blur-lg rounded-full shadow-md">
        {/* Logo - Left Side on Desktop, Centered on Mobile */}
        <div className="flex-1 flex lg:justify-start justify-center">
          <Link href="/" className="flex shrink-0">
            <img
              src="/images/logo-white.png"
              alt="TEDxNIITUniversity"
              className="h-8 md:h-11 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-12">
          {links.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="text-white text-sm xl:text-base font-medium hover:opacity-80 transition-opacity"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side - Button (Desktop Only) */}
        <div className="flex-1 hidden lg:flex justify-end items-center">
          <MetalButton variant="purple" className="text-sm xl:text-base">
            <Link href="/register">Get Tickets</Link>
          </MetalButton>
        </div>
      </div>

      {/* Mobile Hamburger Button - Bottom Left */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed bottom-6 left-6 z-[1001] flex flex-col gap-1.5 w-14 h-14 justify-center items-center border border-white/20 border-t-white/40 border-l-white/30 backdrop-blur-lg rounded-full shadow-md bg-black/20"
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
        ></span>
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""
            }`}
        ></span>
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
        ></span>
      </button>

      {/* Mobile Dropdown Menu - Opens Upward from Bottom */}
      <div
        ref={dropdownRef}
        className="lg:hidden fixed bottom-24 left-6 w-[calc(100%-10rem)] max-w-sm overflow-hidden z-[1000]"
        style={{ height: 0, opacity: 0 }}
      >
        <nav className="border border-white/20 border-t-white/40 border-l-white/30 backdrop-blur-lg rounded-3xl shadow-md p-6 bg-black/20">
          <div ref={menuItemsRef} className="flex flex-col gap-4">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={closeMenu}
                className="text-white text-base font-medium hover:opacity-80 transition-opacity py-2 pl-7"
              >
                {item.name}
              </Link>
            ))}
            <div>
              <Link href="/register" onClick={closeMenu}>
                <MetalButton variant="primary" className="text-sm mt-2">
                  Get Tickets
                </MetalButton>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[-1]"
        ></div>
      )}
    </header>
  );
}
