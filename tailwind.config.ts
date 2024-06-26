import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // Custom Google fonts
      fontFamily: {
        dm_sans: ['var(--font-dm_sans)'],
        dm_mono: ['var(--font-dm_mono)'],
      },
      // Added wider tracking
      letterSpacing: { 
        widester: '0.15em',
      },
      // Clearer blur
      backdropBlur: {
        xs: '2px',
      },
      maxHeight: {
        '2/5': '40%',
      }
    },
  },
  plugins: [],
};
export default config;
