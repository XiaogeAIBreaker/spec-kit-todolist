import React from 'react';
import { GlassBoxProps } from '@/types/theme';
import { GlassContainer } from './styles';

/**
 * 玻璃拟态容器组件
 */
export const GlassBox: React.FC<GlassBoxProps> = ({
  children,
  className,
  variant = 'glass',
  elevated = false,
  interactive = false,
}) => {
  return (
    <GlassContainer
      className={className}
      $variant={variant}
      $elevated={elevated}
      $interactive={interactive}
    >
      {children}
    </GlassContainer>
  );
};
