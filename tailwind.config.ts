import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: {
          bg: '#FAFAFA',
          text: '#1a1a1a',
          border: '#E5E5E5',
          accent: '#2563EB',
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
