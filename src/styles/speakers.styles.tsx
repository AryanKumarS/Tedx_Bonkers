export const SpeakersStyles = () => (
  <style jsx global>{`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .card-image {
      transition: filter 0.4s ease;
    }

    html {
      scroll-behavior: smooth;
    }
    body {
      background: #030508;
      color: white;
      font-family:
        "Inter",
        -apple-system,
        sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Performance optimizations */
    * {
      -webkit-tap-highlight-color: transparent;
    }

    img {
    }

    /* SKIP LINK */
    .skip-link {
      position: absolute;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      padding: 1rem 2rem;
      background: #e62b1e;
      color: white;
      text-decoration: none;
      border-radius: 0.5rem;
      z-index: 9999;
    }
    .skip-link:focus {
      top: 1rem;
    }

    /* BACKGROUND */
    .is-scrolling .particle,
    .is-scrolling .orb,
    .is-scrolling .grid-glow {
      animation-play-state: paused !important;
    }
    .fixed-background {
      position: fixed;
      inset: 0;
      z-index: 0;
    }
    .grid-bg {
      position: absolute;
      inset: 0;
    }
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    }
    .grid-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse at 50% 50%,
        rgba(230, 43, 30, 0.15) 0%,
        transparent 50%
      );
    }
    .particles-container {
      position: absolute;
      inset: 0;
    }
    .particle {
      position: absolute;
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }

    .orbs-container {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
    }
    .orb-1 {
      width: 600px;
      height: 600px;
      top: -200px;
      right: -200px;
      background: radial-gradient(
        circle,
        rgba(230, 43, 30, 0.4) 0%,
        transparent 70%
      );
    }
    .orb-2 {
      width: 500px;
      height: 500px;
      bottom: -150px;
      left: -150px;
      background: radial-gradient(
        circle,
        rgba(230, 43, 30, 0.3) 0%,
        transparent 70%
      );
    }
    .orb-3 {
      width: 400px;
      height: 400px;
      top: 40%;
      left: 30%;
      background: radial-gradient(
        circle,
        rgba(255, 100, 80, 0.2) 0%,
        transparent 70%
      );
    }
    /* FILTER */
    .filter-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .filter-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
    }
    .filter-pills {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }
    .filter-pill {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: background, border-color, transform;
    }
    .filter-pill:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.05);
    }
    .filter-pill-active {
      background: rgba(230, 43, 30, 0.2);
      border-color: #e62b1e;
      color: white;
      transform: scale(1.05);
    }

    /* HERO */
    .hero-section {
      position: relative;
      min-height: 88vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    .hero-content {
      text-align: center;
      padding: 1.5rem;
      z-index: 10;
    }
    .hero-badge {
      display: inline-flex;
      padding: 0.6rem 1.75rem;
      background: rgba(230, 43, 30, 0.1);
      border: 1px solid rgba(230, 43, 30, 0.3);
      border-radius: 9999px;
      margin-bottom: 1.5rem;
    }
    .badge-text {
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #e62b1e;
    }
    .hero-title {
      font-size: clamp(2.25rem, 7vw, 4.5rem);
      font-weight: 800;
      margin-bottom: 1.25rem;
      background: linear-gradient(135deg, #fff 0%, #e62b1e 50%, #fff 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shine 4s ease-in-out infinite;
    }
    @keyframes shine {
      0%,
      100% {
        background-position: 0% center;
      }
      50% {
        background-position: 200% center;
      }
    }
    .title-letter {
      font-size: 6rem;
      display: inline-block;
    }
    .hero-subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1.25rem;
    }
    .hero-line {
      width: 80px;
      height: 2px;
      margin: 0 auto 1.5rem;
      background: linear-gradient(90deg, transparent, #e62b1e, transparent);
    }
    .event-date-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      font-size: 0.875rem;
    }
    .hero-rings {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .hero-ring {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(230, 43, 30, 0.2);
      animation: ringPulse 3s ease-in-out infinite;
    }

    @keyframes ringPulse {
      0%,
      100% {
        border-color: rgba(230, 43, 30, 0.2);
        box-shadow: 0 0 0 rgba(230, 43, 30, 0);
      }
      50% {
        border-color: rgba(230, 43, 30, 0.6);
        box-shadow:
          0 0 20px rgba(230, 43, 30, 0.4),
          0 0 40px rgba(230, 43, 30, 0.2);
      }
    }

    .ring-1 {
      width: 350px;
      height: 350px;
      border-style: dashed;
      animation-delay: 0s;
    }

    .ring-2 {
      width: 500px;
      height: 500px;
      animation-delay: 1s;
    }

    .ring-3 {
      width: 650px;
      height: 650px;
      border-style: dotted;
      animation-delay: 2s;
    }
    /* SCROLL INDICATOR */
    .scroll-indicator-wrapper {
      position: absolute;
      bottom: 1.5rem;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      z-index: 20;
    }
    .scroll-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.75rem;
      position: relative;
      color: white;
    }
    .scroll-ring {
      position: absolute;
      width: 100px;
      height: 100px;
      border: 1px solid rgba(230, 43, 30, 0.3);
      border-radius: 50%;
    }
    .scroll-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      z-index: 1;
    }
    .scroll-mouse {
      width: 22px;
      height: 36px;
      border: 2px solid rgba(255, 255, 255, 0.5);
      border-radius: 11px;
      display: flex;
      justify-content: center;
      padding-top: 8px;
    }
    .scroll-wheel {
      width: 3px;
      height: 6px;
      background: #e62b1e;
      border-radius: 2px;
    }
    .scroll-text {
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.6);
    }

    /* SECTIONS */
    .section-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .section-tag {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      color: #e62b1e;
      margin-bottom: 0.75rem;
    }
    .section-title {
      font-size: 4rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }
    .section-line {
      width: 50px;
      height: 3px;
      margin: 0 auto;
      background: linear-gradient(90deg, #e62b1e, #ff6b5b);
      border-radius: 2px;
    }

    /* SPEAKERS GRID */
    .speakers-section {
      position: relative;
      z-index: 1;
      padding: 2rem 2rem 5rem;
    }
    .speakers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .speaker-card,
    .modal-content {
      transform: translateZ(0);
    }
    .speaker-card {
      position: relative;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform, box-shadow;
    }
    .speaker-card:hover {
      border-color: rgba(230, 43, 30, 0.5);
      box-shadow: 0 20px 40px rgba(230, 43, 30, 0.25);
      transform: translateY(-4px);
    }
    .card-glow {
      position: absolute;
      inset: -1px;
      border-radius: 0;
      background: linear-gradient(135deg, rgba(230, 43, 30, 0.3), transparent);
      opacity: 0;
      filter: blur(20px);
      transition: opacity 0.3s ease-out;
      z-index: -1;
      will-change: opacity;
    }
    .speaker-card:hover .card-glow {
      opacity: 1;
    }
    .card-glare {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        circle at var(--gx, 50%) var(--gy, 50%),
        rgba(255, 255, 255, 0.15),
        transparent 50%
      );
      opacity: 0;
      pointer-events: none;
      z-index: 10;
      transition: opacity 0.3s;
    }
    .speaker-card:hover .card-glare {
      opacity: 1;
    }
    .scan-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(230, 43, 30, 0.8),
        transparent
      );
      opacity: 0;
      z-index: 15;
      display: none;
    }
    @keyframes scan {
      0% {
        top: 0;
      }
      100% {
        top: 100%;
      }
    }
    .card-image-container {
      background: #0b0f16;
      position: relative;
      height: 320px;
      overflow: hidden;
    }
    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      content-visibility: auto;
      contain-intrinsic-size: 500px 320px;
    }
    .image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        transparent 50%,
        rgba(3, 5, 8, 0.9) 100%
      );
      z-index: 2;
    }
    .holographic-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(230, 43, 30, 0.1),
        transparent 50%
      );
      opacity: 0;
      transition: opacity 0.4s;
      z-index: 3;
    }
    .speaker-card:hover .holographic-overlay {
      opacity: 1;
    }
    .category-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.35rem 0.75rem;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(10px);
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 600;
      z-index: 5;
    }
    .card-content {
      padding: 1.25rem;
      position: relative;
      z-index: 5;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .status-indicator {
      animation: pulse 2s infinite;
    }
    .speaker-tag {
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #e62b1e;
    }
    .speaker-name {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 0.4rem;
    }
    .topic-container {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .topic-icon {
      color: #e62b1e;
    }
    .speaker-topic {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
    }
    .view-more {
      margin-top: 0.75rem;
      font-size: 0.8rem;
      color: #e62b1e;
    }
    .corner-accent {
      position: absolute;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(230, 43, 30, 0.3);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .speaker-card:hover .corner-accent {
      opacity: 1;
    }
    .corner-tl {
      top: 8px;
      left: 8px;
      border-right: none;
      border-bottom: none;
    }
    .corner-tr {
      top: 8px;
      right: 8px;
      border-left: none;
      border-bottom: none;
    }
    .corner-bl {
      bottom: 8px;
      left: 8px;
      border-right: none;
      border-top: none;
    }
    .corner-br {
      bottom: 8px;
      right: 8px;
      border-left: none;
      border-top: none;
    }
    .no-results {
      text-align: center;
      padding: 3rem;
      color: rgba(255, 255, 255, 0.5);
    }
    .no-results button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background: #e62b1e;
      border: none;
      border-radius: 0.5rem;
      color: white;
      cursor: pointer;
    }

    /* MODAL */
    /* CINEMATIC FULLSCREEN MODAL */
    .modal-overlay-fullscreen {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: radial-gradient(
        circle at center,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 35%,
        rgba(0, 0, 0, 0.9) 60%,
        rgba(0, 0, 0, 0.4) 85%,
        rgba(0, 0, 0, 0) 100%
      );
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .modal-container-fullscreen {
      position: relative;
      width: 100%;
      height: 100%;
      background: transparent;
      display: flex;
      outline: none;
    }

    .modal-close-btn {
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 1010;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-close-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: rotate(90deg) scale(1.1);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .modal-inner-fullscreen {
      display: flex;
      width: 100%;
      height: 100%;
    }

    .modal-image-side {
      flex: 1;
      height: 100%;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      position: relative;
    }

    .modal-image-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      max-width: 800px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-full-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 50px rgba(230, 43, 30, 0.15));
    }

    .modal-info-side {
      flex: 1;
      height: 100%;
      padding: 6rem 8rem 6rem 4rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: transparent;
      position: relative;
    }

    .modal-background-x {
      position: absolute;
      inset: -20% -10%;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: -1;
      opacity: 0.25;
    }

    .modal-background-x svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: #e62b1e;
      stroke-width: 0.8;
      stroke-linecap: square;
      stroke-linejoin: miter;
    }

    .modal-info-scroll-box {
      max-width: 600px;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .modal-eyebrow {
      display: block;
      color: #e62b1e;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.4em;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
    }

    .modal-full-name {
      font-size: clamp(3rem, 6vw, 3.5rem);
      font-weight: 900;
      line-height: 0.95;
      letter-spacing: -0.04em;
      color: white;
      margin-bottom: 1rem;
      text-transform: uppercase;
    }

    .modal-full-role {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 500;
      margin-bottom: 3rem;
    }

    .modal-divider {
      width: 60px;
      height: 2px;
      background: #e62b1e;
      margin-bottom: 3rem;
    }

    .modal-section-label {
      display: block;
      font-size: 0.7rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.2em;
      margin-bottom: 1.25rem;
    }

    .modal-full-bio {
      font-size: 1.15rem;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 3.5rem;
      max-width: 500px;
    }

    .modal-full-social {
      display: flex;
      gap: 2rem;
    }

    .modal-social-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
      opacity: 0.6;
    }

    .modal-social-link:hover {
      opacity: 1;
      color: #e62b1e;
      transform: translateY(-2px);
    }

    @media (max-width: 1024px) {
      .modal-info-side {
        padding: 4rem;
      }
    }

    @media (max-width: 768px) {
      .modal-inner-fullscreen {
        flex-direction: column;
        overflow-y: auto;
      }

      .modal-image-side {
        flex: none;
        height: 50vh;
        padding: 4rem 2rem 2rem;
      }

      .modal-info-side {
        flex: none;
        height: auto;
        padding: 2rem;
        justify-content: flex-start;
      }

      .modal-full-name {
        font-size: 2.5rem;
      }

      .modal-close-btn {
        top: 1rem;
        right: 1rem;
        width: 50px;
        height: 50px;
      }
    }

    /* BACK TO TOP */
    .back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 90;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(230, 43, 30, 0.9);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(230, 43, 30, 0.4);
    }

    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .newsletter-input-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
    }
    .newsletter-input-container svg {
      color: rgba(255, 255, 255, 0.5);
    }
    .newsletter-input-container input {
      flex: 1;
      background: none;
      border: none;
      color: white;
      outline: none;
    }
    .newsletter-btn {
      padding: 0.75rem;
      background: #e62b1e;
      border: none;
      border-radius: 0.5rem;
      color: white;
      font-weight: 600;
      cursor: pointer;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      /* Disable hover effects on mobile */
      .speaker-card:hover {
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: none;
        transform: none;
      }
      .speaker-card:hover .card-glow {
        opacity: 0;
      }
      .filter-pill:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: none;
      }
      .social-link:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .navbar-links {
        display: none;
      }
      .mobile-menu-btn {
        display: block;
      }
      .nav-cta {
        display: none;
      }
      .hero-ring {
        display: none;
      }
      .featured-grid {
        grid-template-columns: 1fr;
      }
      .speakers-grid {
        grid-template-columns: 1fr;
      }

      /* Mobile Font Sizes */
      .title-letter {
        font-size: clamp(3.2rem, 13vw, 4.2rem);
      }
      .hero-subtitle {
        font-size: 0.9rem;
      }
      .section-title {
        font-size: clamp(2rem, 8vw, 3rem);
      }
      .speaker-name {
        font-size: 1.1rem;
      }
      .speaker-topic {
        font-size: 0.75rem;
      }
      .speaker-tag {
        font-size: 0.55rem;
      }
      .view-more {
        font-size: 0.75rem;
      }

      /* Mobile Hero Section */
      .hero-section {
        height: 60vh;
      }
      .hero-content {
        padding: 1rem;
      }
    }

    @media (max-width: 480px) {
      .title-letter {
        font-size: clamp(2.2rem, 16vw, 3.2rem);
      }
      .hero-subtitle {
        font-size: 0.8rem;
      }
      .section-title {
        font-size: clamp(1.5rem, 10vw, 2.5rem);
      }
      .speaker-name {
        font-size: 1rem;
      }
      .speaker-topic {
        font-size: 0.7rem;
      }

      /* Extra small phones */
      .hero-section {
        height: 60vh;
      }
      .hero-content {
        padding: 0.5rem;
      }
    }
  `}</style>
);
