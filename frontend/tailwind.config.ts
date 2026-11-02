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
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        soft: '0 1px 2px oklch(30% 0.05 155 / 0.06), 0 8px 24px -12px oklch(30% 0.05 155 / 0.18)',
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
      },
      animation: {
        'step-in-next': 'step-in-next 260ms cubic-bezier(0.22, 1, 0.36, 1)',
        'step-in-prev': 'step-in-prev 260ms cubic-bezier(0.22, 1, 0.36, 1)',
        'pop-in': 'pop-in 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        'hero-overlay':
          'linear-gradient(180deg, oklch(20% 0.05 155 / 0.2), oklch(20% 0.05 155 / 0.85))',
      },
    },
  },
};

export default config;
