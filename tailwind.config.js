/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		animation: {
  			'sand-flow': 'sand-flow 3s infinite ease-in-out',
  			rippling: 'rippling var(--duration) ease-out'
  		},
  		keyframes: {
  			'sand-flow': {
  				'0%, 100%': {
  					clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					clipPath: 'polygon(50% 0, 50% 0, 100% 100%, 0 100%)',
  					transform: 'translateY(50%)'
  				}
  			},
  			rippling: {
  				'0%': {
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'scale(2)',
  					opacity: '0'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			navy: '#132440',
  			"ted-red": "#eb0028",
  			"text-color": "var(--text-color)",
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			ted: {
  				red: "var(--ted-red)",
  				"dark-red": "var(--ted-dark-red)",
  				"official-red": "var(--ted-official-red)",
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
