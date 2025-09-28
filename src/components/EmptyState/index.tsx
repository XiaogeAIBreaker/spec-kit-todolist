/**
 * EmptyState组件
 * 空状态提示组件
 */

import React, { useCallback, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { EmptyStateProps } from '@/types/components';
import { defaultTheme } from '@/types/components';

// 动画定义
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -15px, 0);
  }
  70% {
    transform: translate3d(0, -8px, 0);
  }
  90% {
    transform: translate3d(0, -3px, 0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// 样式组件
const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${defaultTheme.spacing.xl} ${defaultTheme.spacing.lg};
  text-align: center;
  min-height: 300px;
  background: ${defaultTheme.colors.surface};
  border: 2px dashed ${defaultTheme.colors.border};
  border-radius: ${defaultTheme.borderRadius.lg};
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200px;
    width: 200px;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }
`;

const EmptyIcon = styled.div<{ $variant: 'default' | 'completed' | 'celebration' }>`
  font-size: 4rem;
  margin-bottom: ${defaultTheme.spacing.lg};
  animation: ${float} 3s ease-in-out infinite;
  user-select: none;
  cursor: default;
  position: relative;

  ${props => props.$variant === 'default' && css`
    &:hover {
      animation: ${bounce} 1s ease-in-out;
    }
  `}

  ${props => props.$variant === 'completed' && css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}

  ${props => props.$variant === 'celebration' && css`
    animation: ${bounce} 1s ease-in-out infinite;
  `}

  &::after {
    content: '✨';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.5rem;
    opacity: 0;
    animation: twinkle 2s ease-in-out infinite;
    animation-delay: 0.5s;
  }

  @keyframes twinkle {
    0%, 100% {
      opacity: 0;
      transform: scale(0.8) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.2) rotate(180deg);
    }
  }
`;

const EmptyTitle = styled.h3`
  margin: 0 0 ${defaultTheme.spacing.md} 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${defaultTheme.colors.text};

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

const EmptyMessage = styled.p`
  margin: 0 0 ${defaultTheme.spacing.xl} 0;
  font-size: 1rem;
  color: ${defaultTheme.colors.textSecondary};
  line-height: 1.6;
  max-width: 320px;

  @media (max-width: 640px) {
    font-size: 0.9rem;
    max-width: 280px;
  }
`;

const ActionButton = styled.button<{ $isHovered: boolean }>`
  padding: ${defaultTheme.spacing.md} ${defaultTheme.spacing.xl};
  border: none;
  border-radius: ${defaultTheme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: ${defaultTheme.spacing.sm};
  background: linear-gradient(135deg, ${defaultTheme.colors.primary} 0%, ${defaultTheme.colors.secondary} 100%);
  color: white;
  box-shadow: ${defaultTheme.shadows.md};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease-in-out;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${defaultTheme.shadows.lg};
    background: linear-gradient(135deg, #5b5fb8 0%, #d63384 100%);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${defaultTheme.shadows.sm};
  }

  &:focus {
    outline: 2px solid ${defaultTheme.colors.primary};
    outline-offset: 2px;
  }

  ${props => props.$isHovered && css`
    animation: ${pulse} 0.6s ease-in-out;
  `}

  @media (max-width: 640px) {
    padding: ${defaultTheme.spacing.md} ${defaultTheme.spacing.lg};
    font-size: 0.9rem;
  }
`;

const TipsContainer = styled.div`
  margin-top: ${defaultTheme.spacing.xl};
  padding: ${defaultTheme.spacing.lg};
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: ${defaultTheme.borderRadius.md};
  max-width: 400px;
`;

const TipsTitle = styled.h4`
  margin: 0 0 ${defaultTheme.spacing.md} 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${defaultTheme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${defaultTheme.spacing.sm};
`;

const TipsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const TipItem = styled.li`
  margin-bottom: ${defaultTheme.spacing.sm};
  font-size: 0.875rem;
  color: ${defaultTheme.colors.textSecondary};
  display: flex;
  align-items: flex-start;
  gap: ${defaultTheme.spacing.sm};
  line-height: 1.5;

  &::before {
    content: '💡';
    font-size: 0.875rem;
    margin-top: 1px;
    flex-shrink: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const KeyboardHint = styled.div`
  margin-top: ${defaultTheme.spacing.lg};
  padding: ${defaultTheme.spacing.md};
  background: ${defaultTheme.colors.background};
  border-radius: ${defaultTheme.borderRadius.sm};
  font-size: 0.75rem;
  color: ${defaultTheme.colors.textSecondary};
  border: 1px solid ${defaultTheme.colors.border};

  kbd {
    padding: 2px 6px;
    background: ${defaultTheme.colors.surface};
    border: 1px solid ${defaultTheme.colors.border};
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.7rem;
    margin: 0 2px;
  }
`;

/**
 * 获取空状态配置
 */
const getEmptyStateConfig = (message?: string) => {
  if (!message) {
    return {
      icon: '📝',
      title: '开始添加待办事项',
      variant: 'default' as const,
      tips: [
        '点击上方的添加按钮或按 Enter 键',
        '写下你想要完成的任务',
        '完成后会有精彩的庆祝动画'
      ]
    };
  }

  if (message.includes('没有待完成')) {
    return {
      icon: '🎉',
      title: '全部完成！',
      variant: 'celebration' as const,
      tips: [
        '太棒了！你已经完成了所有任务',
        '可以添加新的待办事项继续努力',
        '保持这个节奏，你很优秀！'
      ]
    };
  }

  if (message.includes('没有完成')) {
    return {
      icon: '💪',
      title: '开始完成任务吧',
      variant: 'default' as const,
      tips: [
        '点击待办事项的"完成"按钮',
        '或者使用键盘快捷键 Enter',
        '完成任务会有精彩的庆祝效果'
      ]
    };
  }

  return {
    icon: '📝',
    title: '还没有内容',
    variant: 'default' as const,
    tips: [
      '添加第一个待办事项开始使用',
      '支持键盘快捷键操作',
      '数据会自动保存到本地'
    ]
  };
};

/**
 * EmptyState组件
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddFirst,
  message
}) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const config = getEmptyStateConfig(message);

  const handleButtonClick = useCallback(() => {
    onAddFirst();
  }, [onAddFirst]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleButtonClick();
    }
  }, [handleButtonClick]);

  return (
    <EmptyContainer>
      <EmptyIcon
        $variant={config.variant}
        role="img"
        aria-label={`${config.icon} 图标`}
      >
        {config.icon}
      </EmptyIcon>

      <EmptyTitle>{config.title}</EmptyTitle>

      <EmptyMessage>
        {message || '还没有待办事项，添加第一个吧！'}
      </EmptyMessage>

      <ActionButton
        onClick={handleButtonClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        $isHovered={isButtonHovered}
        aria-label="添加第一个待办事项"
      >
        <span>✨</span>
        添加第一个
      </ActionButton>

      <TipsContainer>
        <TipsTitle>
          💡 小贴士
        </TipsTitle>
        <TipsList>
          {config.tips.map((tip, index) => (
            <TipItem key={index}>{tip}</TipItem>
          ))}
        </TipsList>

        <KeyboardHint>
          键盘快捷键：<kbd>Enter</kbd> 添加/完成 · <kbd>Delete</kbd> 删除 · <kbd>Esc</kbd> 取消
        </KeyboardHint>
      </TipsContainer>
    </EmptyContainer>
  );
};

export default EmptyState;