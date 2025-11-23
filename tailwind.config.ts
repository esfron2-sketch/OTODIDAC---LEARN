import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Backgrounds
        main: '#0B1220', // Very dark navy
        surface: '#0F1724', // Dark slate
        card: '#162032', // Slightly lighter for cards
        
        // Accents
        primary: '#7C3AED', // Violet 600
        primaryHover: '#6D28D9',
        secondary: '#FB923C', // Coral Orange
        
        // Text
        light: '#E6EEF3', // Near white
        muted: '#9AA6B2', // Cool grey
        
        // Status
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;