import { GlassmorphismTheme } from '@/types/theme';

/**
 * 玻璃拟态主题配置
 */
export const glassmorphismTheme: GlassmorphismTheme = {
  colors: {
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      text: '#1a1a1a',
      textSecondary: '#666666',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    accent: {
      primary: '#667eea',
      hover: '#764ba2',
      active: '#5a67d8',
    },
  },
  effects: {
    blur: '10px',
    borderRadius: '16px',
    borderWidth: '1px',
    opacity: {
      glass: 0.1,
      hover: 0.15,
    },
  },
  animations: {
    duration: {
      fast: '100ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};
