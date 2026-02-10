"use client"
import ShinyText from "./ShinyText";
import FaultyTerminal from "./FaultyTerminal";

const TicketHero = () => {

  return (
    <div className="rounded-md">
      <section>
        <div className="hero h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-0">
  {/* <FaultyTerminal
  
                scale={2.3}
                gridMul={[2, 1]}
                digitSize={1.2}
                timeScale={0.6}
                pause={false}
                scanlineIntensity={0.5}
                glitchAmount={1}
                flickerAmount={1}
                noiseAmp={1}
                chromaticAberration={0}
                dither={0}
                curvature={0.2}
                tint="#eb0028"
                mouseReact={true}
                mouseStrength={0.5}
                pageLoadAnimation
                brightness={0.8}
              /> */}
            </div>
          </div>
          <div className="text-center text-xl md:text-2xl lg:text-3xl font-thin relative z-10 pointer-events-none select-none">
            <h2 className="text-[#b5b5b5] text-3xl">BUY</h2>
            <ShinyText
              text="Tickets"
              speed={2}
              delay={0}
              color="#b5b5b5"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
              className="font-bold text-8xl md:text-9xl pointer-events-auto"
            />
            <h2 className="text-[#b5b5b5] text-3xl">NOW</h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TicketHero;
