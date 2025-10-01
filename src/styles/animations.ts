import { keyframes } from 'styled-components';

/**
 * 完成动画 - 缩放效果
 */
export const completionAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

/**
 * 悬停抬升动画配置
 */
export const hoverLiftAnimation = {
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
};

/**
 * 动画时长配置
 */
export const animationDurations = {
  fast: '100ms',
  normal: '300ms',
  slow: '500ms',
};

/**
 * 缓动函数配置
 */
export const easingFunctions = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};
