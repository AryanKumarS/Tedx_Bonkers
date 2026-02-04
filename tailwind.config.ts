import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#132440",
        "ted-red": "#eb0028",
        "text-color": "var(--text-color)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        ted: {
          red: "var(--ted-red)",
          "dark-red": "var(--ted-dark-red)",
          "official-red": "var(--ted-official-red)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        logoFont: ["logoFont", "sans-serif"],
      },
      height: {
        screen: "100dvh", // Override default 100vh with dynamic viewport
      },
      minHeight: {
        screen: "100dvh", // Override min-h-screen to use dynamic viewport
      },
    },
  },
  plugins: [],
} satisfies Config;
