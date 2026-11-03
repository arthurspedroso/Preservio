import type { Config } from 'tailwindcss';

const color = (name: string) => `oklch(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        border: color('border'),
        input: color('input'),
        ring: color('ring'),
        background: color('background'),
        foreground: color('foreground'),
        brand: { DEFAULT: color('brand'), foreground: color('brand-foreground') },
        primary: { DEFAULT: color('primary'), foreground: color('primary-foreground') },
        secondary: { DEFAULT: color('secondary'), foreground: color('secondary-foreground') },
        destructive: { DEFAULT: color('destructive'), foreground: color('destructive-foreground') },
        warning: { DEFAULT: color('warning'), foreground: color('warning-foreground') },
        success: { DEFAULT: color('success'), foreground: color('success-foreground') },
        info: { DEFAULT: color('info'), foreground: color('info-foreground') },
        muted: { DEFAULT: color('muted'), foreground: color('muted-foreground') },
        accent: { DEFAULT: color('accent'), foreground: color('accent-foreground') },
        card: { DEFAULT: color('card'), foreground: color('card-foreground') },
        'hero-scrim': color('hero-scrim'),
        sidebar: {
          DEFAULT: color('sidebar'),
          foreground: color('sidebar-foreground'),
          primary: color('sidebar-primary'),
          'primary-foreground': color('sidebar-primary-foreground'),
          accent: color('sidebar-accent'),
          'accent-foreground': color('sidebar-accent-foreground'),
          border: color('sidebar-border'),
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 2px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        soft: '0 1px 2px oklch(30% 0.03 155 / 0.05)',
        overlay:
          '0 2px 6px oklch(30% 0.03 155 / 0.08), 0 16px 40px -12px oklch(30% 0.03 155 / 0.25)',
      },
      // Transição entre etapas do formulário; desativada por prefers-reduced-motion (globals.css)
      keyframes: {
        'step-in-next': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'step-in-prev': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'scale(0.6)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'step-in-next': 'step-in-next 260ms cubic-bezier(0.22, 1, 0.36, 1)',
        'step-in-prev': 'step-in-prev 260ms cubic-bezier(0.22, 1, 0.36, 1)',
        'pop-in': 'pop-in 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fade-in 150ms ease-out',
      },
      backgroundImage: {
        // Escurece o lado do texto; a foto segue visível à direita
        'hero-overlay':
          'linear-gradient(90deg, oklch(18% 0.04 146 / 0.85), oklch(18% 0.04 146 / 0.5) 60%, oklch(18% 0.04 146 / 0.2))',
        'hero-fade':
          'linear-gradient(180deg, oklch(20% 0.05 155 / 0.1), oklch(20% 0.05 155 / 0.85))',
      },
    },
  },
};

export default config;
