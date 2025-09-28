/**
 * CompletionCelebration组件
 * 完成待办事项的庆祝动画
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { CompletionCelebrationProps } from '@/types/components';
import { defaultTheme } from '@/types/components';

// 庆祝动画定义
const celebrationEnter = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(50px);
  }
  20% {
    opacity: 1;
    transform: scale(1.1) translateY(-10px);
  }
  40% {
    transform: scale(0.95) translateY(0);
  }
  60% {
    transform: scale(1.02) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const celebrationExit = keyframes`
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.8) translateY(-30px);
  }
`;

const confettiFall = keyframes`
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
`;

const sparkle = keyframes`
  0%, 100% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1) rotate(180deg);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
`;

const textGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(16, 185, 129, 0.8), 0 0 30px rgba(16, 185, 129, 0.6);
  }
`;

// 样式组件
const CelebrationOverlay = styled.div<{ $show: boolean; $exiting: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  pointer-events: ${props => props.$show ? 'auto' : 'none'};
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.3s ease-in-out;

  ${props => props.$exiting && css`
    animation: ${celebrationExit} 0.5s ease-in-out forwards;
  `}
`;

const CelebrationContainer = styled.div<{ $show: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${defaultTheme.spacing.xl};
  padding: ${defaultTheme.spacing.xl};
  background: ${defaultTheme.colors.background};
  border-radius: ${defaultTheme.borderRadius.lg};
  box-shadow: ${defaultTheme.shadows.lg};
  max-width: 400px;
  width: 90%;
  text-align: center;
  position: relative;
  overflow: hidden;

  ${props => props.$show && css`
    animation: ${celebrationEnter} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `}

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
    animation: ${pulse} 2s ease-in-out infinite;
    pointer-events: none;
  }
`;

const CelebrationIcon = styled.div`
  font-size: 4rem;
  animation: ${pulse} 1.5s ease-in-out infinite;
  position: relative;

  &::after {
    content: '✨';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.5rem;
    animation: ${sparkle} 1s ease-in-out infinite;
    animation-delay: 0.5s;
  }

  &::before {
    content: '🎉';
    position: absolute;
    top: -10px;
    left: -10px;
    font-size: 1.5rem;
    animation: ${sparkle} 1s ease-in-out infinite;
    animation-delay: 1s;
  }
`;

const CelebrationTitle = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: ${defaultTheme.colors.success};
  animation: ${textGlow} 2s ease-in-out infinite;
  text-align: center;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const CelebrationMessage = styled.p`
  margin: 0;
  font-size: 1.125rem;
  color: ${defaultTheme.colors.text};
  line-height: 1.6;
  max-width: 300px;

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

const CompletedTask = styled.div`
  padding: ${defaultTheme.spacing.md};
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid ${defaultTheme.colors.success};
  border-radius: ${defaultTheme.borderRadius.md};
  color: ${defaultTheme.colors.text};
  font-weight: 500;
  word-break: break-word;
  max-width: 100%;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${defaultTheme.spacing.md};
  margin-top: ${defaultTheme.spacing.md};

  @media (max-width: 640px) {
    flex-direction: column;
    width: 100%;
  }
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: ${defaultTheme.spacing.md} ${defaultTheme.spacing.lg};
  border: none;
  border-radius: ${defaultTheme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-width: 120px;

  ${props => props.$variant === 'primary' && css`
    background: ${defaultTheme.colors.success};
    color: white;

    &:hover {
      background: #059669;
      transform: translateY(-1px);
      box-shadow: ${defaultTheme.shadows.md};
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${props => props.$variant === 'secondary' && css`
    background: transparent;
    color: ${defaultTheme.colors.textSecondary};
    border: 2px solid ${defaultTheme.colors.border};

    &:hover {
      border-color: ${defaultTheme.colors.primary};
      color: ${defaultTheme.colors.primary};
      background: rgba(99, 102, 241, 0.05);
    }
  `}

  &:focus {
    outline: 2px solid ${defaultTheme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    min-width: auto;
    width: 100%;
  }
`;

const ProgressTimer = styled.div`
  width: 100%;
  margin-top: ${defaultTheme.spacing.lg};
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 4px;
  background: ${defaultTheme.colors.surface};
  border-radius: ${defaultTheme.borderRadius.sm};
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: linear-gradient(90deg, ${defaultTheme.colors.success} 0%, ${defaultTheme.colors.warning} 100%);
  transition: width 0.1s linear;
  border-radius: ${defaultTheme.borderRadius.sm};
`;

const TimerText = styled.div`
  text-align: center;
  margin-top: ${defaultTheme.spacing.sm};
  font-size: 0.875rem;
  color: ${defaultTheme.colors.textSecondary};
`;

const ConfettiContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`;

const ConfettiPiece = styled.div<{ delay: number; left: number; color: string }>`
  position: absolute;
  top: -10px;
  left: ${props => props.left}%;
  width: 8px;
  height: 8px;
  background: ${props => props.color};
  animation: ${confettiFall} 3s linear infinite;
  animation-delay: ${props => props.delay}s;
  border-radius: 2px;
`;

// 彩纸颜色
const confettiColors = [
  '#10b981', '#6366f1', '#ec4899', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'
];

/**
 * CompletionCelebration组件
 */
export const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  $show,
  todoText,
  onAnimationEnd,
  duration = 20000 // 默认20秒
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [confetti, setConfetti] = useState<Array<{ id: number; delay: number; left: number; color: string }>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // 生成彩纸
  const generateConfetti = useCallback(() => {
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      left: Math.random() * 100,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)]
    }));
    setConfetti(pieces);
  }, []);

  // 处理关闭
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onAnimationEnd();
      setIsExiting(false);
      setTimeLeft(duration);
    }, 500);
  }, [onAnimationEnd, duration]);

  // 自动关闭定时器
  useEffect(() => {
    if ($show) {
      generateConfetti();
      setTimeLeft(duration);

      // 设置自动关闭定时器
      timerRef.current = setTimeout(() => {
        handleClose();
      }, duration);

      // 设置倒计时
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 100) {
            return 0;
          }
          return prev - 100;
        });
      }, 100);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      };
    }
  }, [$show, duration, generateConfetti, handleClose]);

  // 键盘事件处理
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      handleClose();
    }
  }, [handleClose]);

  // 计算进度百分比
  const progressPercentage = Math.max(0, (timeLeft / duration) * 100);
  const secondsLeft = Math.ceil(timeLeft / 1000);

  if (!$show) {
    return null;
  }

  return (
    <CelebrationOverlay
      $show={$show}
      $exiting={isExiting}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
      aria-describedby="celebration-message"
      tabIndex={-1}
    >
      <CelebrationContainer
        $show={$show}
        onClick={(e) => e.stopPropagation()}
      >
        <ConfettiContainer>
          {confetti.map((piece) => (
            <ConfettiPiece
              key={piece.id}
              delay={piece.delay}
              left={piece.left}
              color={piece.color}
            />
          ))}
        </ConfettiContainer>

        <CelebrationIcon>
          🎉
        </CelebrationIcon>

        <div>
          <CelebrationTitle id="celebration-title">
            太棒了！
          </CelebrationTitle>
          <CelebrationMessage id="celebration-message">
            你又完成了一个待办事项！
          </CelebrationMessage>
        </div>

        <CompletedTask>
          "{todoText}"
        </CompletedTask>

        <ActionButtons>
          <ActionButton
            $variant="primary"
            onClick={handleClose}
            aria-label="继续工作"
          >
            继续加油！
          </ActionButton>
          <ActionButton
            $variant="secondary"
            onClick={handleClose}
            aria-label="关闭庆祝"
          >
            关闭
          </ActionButton>
        </ActionButtons>

        <ProgressTimer>
          <ProgressBarContainer>
            <ProgressBarFill percentage={progressPercentage} />
          </ProgressBarContainer>
          <TimerText>
            {secondsLeft > 0 ? `${secondsLeft}秒后自动关闭` : '正在关闭...'}
          </TimerText>
        </ProgressTimer>
      </CelebrationContainer>
    </CelebrationOverlay>
  );
};

export default CompletionCelebration;