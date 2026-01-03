/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Noyrax Logo Colors (exakt)
        'logo-bg': '#2F3237', // Dunkles Anthrazit (Hintergrund)
        'logo-bg-alt': '#3A3D42', // Graphitgrau (Alternative)
        'logo-white': '#FFFFFF', // Reines Weiß (Text, große Knoten)
        'logo-cyan': '#1FD1D1', // Türkis/Cyan (Knoten, Linien)
        'logo-cyan-bright': '#2EE6E6', // Helles Türkis
        'logo-glow': '#00E5E5', // Neon-Cyan (Glow)
        'logo-glow-bright': '#3CF2F2', // Helles Neon-Cyan
        'logo-gray': '#BFC3C8', // Gedämpftes Hellgrau (dünne Linien)
        // Aliases für Kompatibilität
        'noyrax-blue': '#1FD1D1', // Haupt-Akzent
        'doc-navy': '#2F3237', // Haupt-Hintergrund
        // Status Colors (angepasst für dunklen Hintergrund)
        'success-green': '#10B981',
        'drift-orange': '#F59E0B',
        'error-red': '#EF4444',
        // Neutral Colors (angepasst)
        'slate-900': '#2F3237',
        'slate-800': '#3A3D42',
        'slate-700': '#4A4D52',
        'slate-100': '#FFFFFF',
        'slate-500': '#BFC3C8',
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

