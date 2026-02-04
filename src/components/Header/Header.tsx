import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const isSticky = false;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleHeaderClick = () => {
   
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      <header
        id="myHeader"
        onClick={handleHeaderClick} // Add click handler to toggle stickiness
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isSticky ? "bg-black backdrop-blur-lg" : "bg-transparent"
        }`}
      >
        <nav
          className={`fixed left-0 right-0 top-5 mx-auto flex items-center justify-center rounded-full px-6 py-3 transition-all duration-500 ${
            isSticky
              ? "bg-white/10 backdrop-blur-md w-[70px] h-[70px]"
              : "bg-white/15 backdrop-blur-lg w-[60%] h-[70px]"
          }`}
        >
          <div className="flex items-center">
            <Link href="/">
              <div className="w-150 h-150">
                <Image
                  src="/images/logo-rights.png"
                  alt="TedxNiituniversity"
                  width={190}
                  height={190}
                  className="cursor-pointer transition-transform duration-500 hover:scale-110"
                />
              </div>
            </Link>
          </div>

          
          <div
            className={`flex items-center space-x-4 md:flex transition-opacity duration-500 ${
              isSticky
                ? "opacity-0 pointer-events-none"
                : "opacity-100 pointer-events-auto"
            }`}
          >
            

            <Link
              href="/register"
              className="bg-[#eb0028] text-white px-6 py-2 rounded-full hover:bg-[#fc4f4f] transition-colors duration-300"
            >
              Tickets
            </Link>
          </div>

          <button
            id="openmenu"
            className={`absolute left-0 right-0 mx-auto w-[60px] h-[60px] rounded-full backdrop-blur-md border border-white/10 bg-black/30 flex flex-col justify-center items-center cursor-pointer transition-transform duration-500 ${
              isSticky ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            onClick={handleMenuToggle}
          >
            <div className="relative inline-block w-[130px] h-[130px] mt-2">
              <Image
                src="/images/color_hourglass.png"
                alt="TEDx Event"
                fill
                objectFit="cover"
                className="z-0"
              />
              <div className="absolute inset-0"></div>
            </div>
          </button>
        </nav>
      </header>

      {/* Dimmed Background and Blur Effect */}
      <div
        id="page"
        className={`transition-transform duration-500 ${
          isMenuOpen ? "opacity-60 blur-xl scale-110" : "opacity-100 blur-0"
        }`}
      ></div>
    </>
  );
}
