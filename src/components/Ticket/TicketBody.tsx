"use client"
import VinylRecord from "./VinylRecord";
import { Check } from "lucide-react";
import PixelTransition from "./PixelTransition";
import { useState } from "react";
import TicketRegistrationModal from "./TicketRegistrationModal";
import { memo } from "react";
import dynamic from "next/dynamic";

const PixelBlast = dynamic(() => import("./PixelBlast"), {
  ssr: false,
});

const isMobile =
  typeof window !== "undefined" &&
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

const MemoPixelBlast = memo(PixelBlast);
const TicketBody = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<
    "VIP" | "General" | "Bundle" | "Outsider"
  >("VIP");

  const openModal = (type: "VIP" | "General" | "Bundle" | "Outsider") => {
    if (isModalOpen) return;
    setSelectedTicketType(type);
    setIsModalOpen(true);
  };
  return (
    <div className="w-full">
      {/* =========================================
          SECTION 2: GENERAL ADMISSION (Red Theme)
          ========================================= */}
      <div className="relative w-full min-h-screen md:h-[105vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {!isModalOpen && <PixelBlast
              variant="square"
              pixelSize={5}
              color="#009db2" /* Rose-600 color for red theme */
              patternScale={2.25}
              patternDensity={1.25}
              pixelSizeJitter={0.45}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              speed={1.25}
              edgeFade={0.01}
              transparent
            />
          }
        </div>
        <section className="General-ticket-Section relative z-10 flex flex-col md:flex-row-reverse w-full h-full min-h-screen p-2 gap-2 pointer-events-none items-center justify-evenly">
          {/* RIGHT (Desktop): Vinyl Record - Disc extends LEFT */}
          <div
            className="
              relative flex items-center justify-center pointer-events-none
              w-full h-[50vh] 
              md:w-[45vw] md:h-full
          "
          >
            <div className="pointer-events-auto">
              <VinylRecord
                coverSrc="/tickets/Ticket-1.png" /* Assuming filename, user didn't specify but pattern holds */
                backCoverSrc="/tickets/ticket 1 back.png" /* Assuming pattern */
                isPlaying={true}
                centerColor="#009db2"
                discSide="left"
              />
            </div>
          </div>

          {/* LEFT (Desktop): Perks Text */}
          <div
            className="
              relative flex items-center justify-center overflow-visible pointer-events-none
              bg-black/60 backdrop-blur-md border-t md:border-t-0 md:border-r border-white/10 rounded-3xl
              w-full h-auto min-h-[50vh]
              md:w-[40vw] md:h-auto p-4 md:p-8
          "
          >
            <div className="pointer-events-auto p-4 md:p-8 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-[#009db2] mb-6 md:mb-8 text-center drop-shadow-md">
                Attendee Ticket Perks
              </h2>

              <ul className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                {[
                  "Access to the main event, including speaker sessions and general activities.",
                  "Event kit (e.g., Event Menu, Mug and Notebook).",
                  "Access to general seating, available on a first-come, first-served basis.",
                  "Participate in open networking sessions with other attendees.",
                  "Complimentary light refreshments/snacks along with lunch(veg/non-veg) during breaks.",
                ].map((perk, index) => (
                  <li key={index} className="flex items-start gap-3 md:gap-4">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-[#009db2] mt-1 flex-shrink-0" />
                    <span className="text-gray-200 text-sm md:text-lg leading-relaxed drop-shadow-sm font-medium">
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col items-center gap-6">
                {/* Bundle Options Block (Commented out for future use) */}
                <div className="text-center mb-4">
                  <h3 className="text-[#009db2] text-xl md:text-2xl font-extrabold tracking-tighter animate-pulse mb-4">
                    Limited Time Bundle Options:
                  </h3>
                  <div className="flex flex-row gap-4">
                    <p className="text-white text-base md:text-lg">
                      Double - <br /> 1499/-
                    </p>
                    <p className="text-white text-base md:text-lg">
                      Triple - <br /> 2199/-
                    </p>
                    <p className="text-white text-base md:text-lg">
                      Quad - <br /> 2899/-
                    </p>
                    <p className="text-white text-base md:text-lg">
                      Five - <br /> 3599/-
                    </p>
                    {/* <p className="text-white text-base">Group of Six - <br /> 4299/-</p> */}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <p className="text-[#009db2] text-xl md:text-2xl font-semibold">
                    Get your tickets @
                  </p>
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <div className="flex flex-col items-center gap-8 w-full">
                      {/* Price Indicator Centered */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                          <button
                            disabled={isModalOpen}
                            className="
                                bg-[#009db2] hover:bg-[#008c9e] text-black font-extrabold text-base md:text-lg 
                                py-3 px-8 md:py-4 md:px-10 rounded-lg 
                                transition-all duration-300 transform hover:scale-105 
                                shadow-lg hover:shadow-[#009db2]/25 
                                whitespace-nowrap 
                              "
                            onClick={() => openModal("General")}
                          >
                            Buy General Ticket
                          </button>

                          <PixelTransition
                            firstContent={
                              <div className="w-full h-full flex items-center justify-center text-xs md:text-sm font-bold tracking-widest text-[#009db2]/80 text-center px-2 font-sans">
                                <span className="md:hidden">
                                  TAP TO REVEAL PRICE
                                </span>
                                <span className="hidden md:block">
                                  HOVER TO REVEAL PRICE
                                </span>
                              </div>
                            }
                            secondContent={
                              <div className="w-full h-full flex items-center justify-center text-xl md:text-2xl font-bold text-[#009db2] font-sans">
                                ₹849/-
                              </div>
                            }
                            gridSize={12}
                            pixelColor="#009db2"
                            animationStepDuration={0.4}
                            className="w-48 h-14 md:w-56 md:h-16 rounded-lg border border-[#009db2]/30 bg-black/50 overflow-hidden cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Subtle Partition */}
                      <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#009db2]/30 to-transparent -mt-2" />

                      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full -mt-4">
                        <div className="flex flex-col items-center gap-3">
                          <button
                            className="
                            bg-[#009db2] hover:bg-[#008c9e] text-black font-extrabold text-base md:text-lg py-3 px-8 md:py-4 md:px-10 rounded-lg 
                            transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#009db2]/25
                          "
                            disabled={isModalOpen}
                            onClick={() => openModal("Bundle")}
                          >
                            Buy Bundle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================
          SECTION 1: VIP TICKETS (Cyan Theme)
          ========================================= */}
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
         {!isModalOpen && <PixelBlast
              variant="square"
              pixelSize={5}
              color="#c3c3c3"
              patternScale={2.25}
              patternDensity={1.25}
              pixelSizeJitter={0.45}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              speed={1.25}
              edgeFade={0.01}
              transparent
            />
          }
        </div>
        <section className="VIP-ticket-Section relative z-10 flex flex-col md:flex-row w-full h-full min-h-screen p-2 gap-2 pointer-events-none items-center justify-evenly">
          {/* LEFT: Vinyl Record */}
          <div
            className="
              relative flex items-center justify-center pointer-events-none
              w-full h-[50vh] 
              md:w-[45vw] md:h-full
          "
          >
            <div className="pointer-events-auto">
              <VinylRecord
                coverSrc="/tickets/vip ticket 1.png"
                backCoverSrc="/tickets/vip tic back.png"
                isPlaying={true}
                centerColor="#c3c3c3"
              />
            </div>
          </div>

          {/* RIGHT: VIP Perks Text */}
          <div
            className="
              relative flex items-center justify-center overflow-visible pointer-events-none
              bg-black/60 backdrop-blur-md border-t md:border-t-0 md:border-l border-white/10 rounded-3xl
              w-full h-auto min-h-[50vh]
              md:w-[40vw] md:h-auto p-4 md:p-8
          "
          >
            <div className="pointer-events-auto p-4 md:p-8 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-[#c3c3c3] mb-6 md:mb-8 text-center drop-shadow-md">
                VIP Ticket Perks
              </h2>

              <ul className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                {[
                  "Priority entry to the event, avoiding general admission queues.",
                  "Premium Seating, reserved seating in the VIP section, offering the best views of the stage.",
                  "Event Kit (e.g. Event Menu, Mug, and Notebook).",
                  "Opportunity to meet and take photos with speakers or performers (if permitted).",
                  "Complimentary light refreshments/snacks during breaks.",
                ].map((perk, index) => (
                  <li key={index} className="flex items-start gap-3 md:gap-4">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-[#c3c3c3] mt-1 flex-shrink-0" />
                    <span className="text-gray-200 text-sm md:text-lg leading-relaxed drop-shadow-sm font-medium">
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col items-center gap-4 md:gap-6">
                <p className="text-[#c3c3c3] text-xl md:text-2xl font-semibold">
                  Get your tickets @
                </p>
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  <button
                    className="
                      bg-[#c3c3c3] hover:bg-[#b0b0b0] text-black font-extrabold text-base md:text-lg py-3 px-8 md:py-4 md:px-10 rounded-lg
                      transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#c3c3c3]/25
                    "
                    disabled={isModalOpen}
                    onClick={() => openModal("VIP")}
                  >
                    Buy VIP Tickets
                  </button>

                  <PixelTransition
                    firstContent={
                      <div className="w-full h-full flex items-center justify-center text-xs md:text-sm font-bold tracking-widest text-[#c3c3c3]/80 text-center px-2 font-sans">
                        <span className="md:hidden">TAP TO REVEAL PRICE</span>
                        <span className="hidden md:block">
                          HOVER TO REVEAL PRICE
                        </span>
                      </div>
                    }
                    secondContent={
                      <div className="w-full h-full flex items-center justify-center text-xl md:text-2xl font-bold text-[#c3c3c3] font-sans">
                        ₹2499/-
                      </div>
                    }
                    gridSize={12}
                    pixelColor="#c3c3c3"
                    animationStepDuration={0.4}
                    className="w-48 h-14 md:w-56 md:h-16 rounded-lg border border-[#c3c3c3]/30 bg-black/50 overflow-hidden cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          {!isModalOpen && <PixelBlast
              variant="square"
              pixelSize={5}
              color="#F43F5E" /* Rose-600 color for red theme */
              patternScale={2.25}
              patternDensity={1.25}
              pixelSizeJitter={0.45}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              speed={1.25}
              edgeFade={0.01}
              transparent
            />
          }
        </div>
        <section className="General-ticket-Section relative z-10 flex flex-col md:flex-row-reverse w-full h-full min-h-screen p-2 gap-2 pointer-events-none items-center justify-evenly">
          {/* RIGHT (Desktop): Vinyl Record - Disc extends LEFT */}
          <div
            className="
              relative flex items-center justify-center pointer-events-none
              w-full h-[50vh] 
              md:w-[45vw] md:h-full
          "
          >
            <div className="pointer-events-auto">
              <VinylRecord
                coverSrc="/tickets/Ticket-1.png" /* Assuming filename, user didn't specify but pattern holds */
                backCoverSrc="/tickets/ticket 1 back.png" /* Assuming pattern */
                isPlaying={true}
                centerColor="#009db2"
                discSide="left"
              />
            </div>
          </div>

          {/* LEFT (Desktop): Perks Text */}
          <div
            className="
              relative flex items-center justify-center overflow-visible pointer-events-none
              bg-black/60 backdrop-blur-md border-t md:border-t-0 md:border-r border-white/10 rounded-3xl
              w-full h-auto min-h-[50vh]
              md:w-[40vw] md:h-auto p-4 md:p-8
          "
          >
            <div className="pointer-events-auto p-4 md:p-8 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-[#F43F5E] mb-6 md:mb-8 text-center drop-shadow-md">
                Visitor Ticket Perks
              </h2>

              <ul className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                {[
                  "Access to the main event, including speaker sessions and general activities.",
                  "Event kit (e.g., Event Menu, Mug, Notebook etc.).",
                  "Access to general seating, available on a first-come, first-served basis.",
                  "Participate in open networking sessions with other attendees.",
                  "Complimentary light refreshments/snacks along with lunch(veg/non-veg) during breaks.",
                  "Reserved space for parking of vehicles",
                ].map((perk, index) => (
                  <li key={index} className="flex items-start gap-3 md:gap-4">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-[#009db2] mt-1 flex-shrink-0" />
                    <span className="text-gray-200 text-sm md:text-lg leading-relaxed drop-shadow-sm font-medium">
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col items-center gap-6">
                {/* Bundle Options Block (Commented out for future use) */}
                {/* <div className="text-center mb-4">
                  <h3 className="text-[#009db2] text-xl md:text-2xl font-extrabold tracking-tighter animate-pulse mb-4">Limited Time Bundle Options:</h3>
                  <div className="flex flex-row gap-4">
                    <p className="text-white text-base">Double - <br /> 1499/-</p>
                    <p className="text-white text-base">Triple - <br /> 2199/-</p>
                    <p className="text-white text-base">Quad - <br /> 2899/-</p>
                    <p className="text-white text-base">Five - <br /> 3599/-</p>
                  </div>
                </div> */}
                <div className="text-center mb-4">
                  <h3 className="text-[#F43F5E] text-xl md:text-2xl font-extrabold tracking-tighter mb-6">
                    Event Ticket Price - ₹1000/-
                  </h3>

                  <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <h3 className="text-[#F43F5E] text-xl md:text-2xl font-extrabold tracking-tighter mb-">
                      Stay (Optional) &nbsp;&nbsp; -<br />
                      (Payment on arrival)
                    </h3>
                    <p className="text-white text-base text-lg md:text-xl">
                      Single Room - <br /> ₹945/-
                    </p>
                    <p className="text-white text-base text-lg md:text-xl">
                      Double Room - <br /> ₹1330/-
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <p className="text-[#F43F5E] text-xl md:text-2xl font-semibold">
                    Get your tickets @
                  </p>
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <div className="flex flex-col items-center gap-8 w-full">
                      {/* Price Indicator Centered */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                          <button
                            className="
                                bg-[#F43F5E] hover:bg-[#F43F5E]/80 text-black font-extrabold text-base md:text-lg 
                                py-3 px-8 md:py-4 md:px-10 rounded-lg 
                                transition-all duration-300 transform hover:scale-105 
                                shadow-lg hover:shadow-[#F43F5E]/25
                                whitespace-nowrap
                              "
                            disabled={isModalOpen}
                            onClick={() => openModal("Outsider")}
                          >
                            Buy Visitor Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <TicketRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTicketType={selectedTicketType}
      />
    </div>
  );
};

export default TicketBody;
