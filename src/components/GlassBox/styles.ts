import styled, { css } from 'styled-components';
import { glassmorphismTheme } from '@/styles/theme';

interface GlassContainerProps {
  $variant?: 'glass' | 'solid';
  $elevated?: boolean;
  $interactive?: boolean;
}

export const GlassContainer = styled.div<GlassContainerProps>`
  /* 基础玻璃拟态样式 */
  background: ${glassmorphismTheme.colors.glass.background};
  border: ${glassmorphismTheme.effects.borderWidth} solid ${glassmorphismTheme.colors.glass.border};
  border-radius: ${glassmorphismTheme.effects.borderRadius};

  /* 玻璃模糊效果 - 优雅降级 */
  @supports (backdrop-filter: blur(${glassmorphismTheme.effects.blur})) {
    backdrop-filter: blur(${glassmorphismTheme.effects.blur});
  }

  /* 过渡动画 */
  transition: all ${glassmorphismTheme.animations.duration.normal} ${glassmorphismTheme.animations.easing.default};

  /* 抬升效果 */
  ${props => props.$elevated && css`
    box-shadow: 0 8px 32px ${glassmorphismTheme.colors.glass.shadow};
  `}

  /* 交互动画 */
  ${props => props.$interactive && css`
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      background: rgba(255, 255, 255, ${glassmorphismTheme.effects.opacity.hover});
    }

    &:active {
      transform: translateY(0);
    }
  `}

  /* 实心变体 */
  ${props => props.$variant === 'solid' && css`
    background: ${glassmorphismTheme.colors.accent.primary};
    backdrop-filter: none;
    color: white;
  `}
`;
