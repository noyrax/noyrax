/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Noyrax Branding Colors (angepasst an Logo)
        'noyrax-blue': '#00D9FF', // Logo-Akzent: Leuchtendes Hellblau/Cyan
        'doc-navy': '#1E3A5F', // Logo-Hintergrund: Dunkelgrau
        'logo-accent': '#00D9FF', // Logo-Akzent (Alias für noyrax-blue)
        'logo-bg': '#1E3A5F', // Logo-Hintergrund (Alias für doc-navy)
        // Status Colors
        'success-green': '#10B981',
        'drift-orange': '#F59E0B',
        'error-red': '#EF4444',
        // Neutral Colors
        'slate-900': '#0F172A',
        'slate-100': '#F1F5F9',
        'slate-500': '#64748B',
      },
      fontFamily: {
        'headline': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'code': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

