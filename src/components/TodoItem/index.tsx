/**
 * TodoItem组件
 * 单个待办事项的展示和操作
 */

import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { TodoItemProps } from '@/types/components';
import { defaultTheme } from '@/types/components';

// 动画定义
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
`;

const completionPulse = keyframes`
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

// 样式组件
const TodoItemContainer = styled.div<{ completed: boolean; isAnimating: boolean }>`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.spacing.md};
  padding: ${defaultTheme.spacing.md};
  background: ${defaultTheme.colors.surface};
  border: 1px solid ${defaultTheme.colors.border};
  border-radius: ${defaultTheme.borderRadius.md};
  box-shadow: ${defaultTheme.shadows.sm};
  transition: all 0.2s ease-in-out;
  animation: ${slideIn} 0.3s ease-out;

  ${props => props.completed && css`
    background: rgba(16, 185, 129, 0.1);
    border-color: ${defaultTheme.colors.success};
    opacity: 0.8;
  `}

  ${props => props.isAnimating && css`
    animation: ${completionPulse} 0.5s ease-in-out;
  `}

  &:hover {
    box-shadow: ${defaultTheme.shadows.md};
    transform: translateY(-1px);
  }

  &.deleting {
    animation: ${fadeOut} 0.2s ease-in-out forwards;
  }
`;

const TodoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TodoText = styled.span<{ completed: boolean }>`
  display: block;
  font-size: 1rem;
  line-height: 1.5;
  color: ${props => props.completed ? defaultTheme.colors.textSecondary : defaultTheme.colors.text};
  word-wrap: break-word;
  overflow-wrap: break-word;

  ${props => props.completed && css`
    text-decoration: line-through;
  `}
`;

const TodoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.spacing.sm};
  margin-top: ${defaultTheme.spacing.xs};
  font-size: 0.75rem;
  color: ${defaultTheme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ completed: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: ${defaultTheme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.completed ? defaultTheme.colors.success : defaultTheme.colors.warning};
  color: white;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${defaultTheme.spacing.sm};
`;

const ActionButton = styled.button<{ $variant: 'complete' | 'delete' }>`
  padding: ${defaultTheme.spacing.sm} ${defaultTheme.spacing.md};
  border: none;
  border-radius: ${defaultTheme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 4px;

  ${props => props.$variant === 'complete' && css`
    background: ${defaultTheme.colors.success};
    color: white;

    &:hover {
      background: #059669;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${props => props.$variant === 'delete' && css`
    background: ${defaultTheme.colors.error};
    color: white;

    &:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:focus {
    outline: 2px solid ${defaultTheme.colors.primary};
    outline-offset: 2px;
  }
`;

// 时间格式化函数
const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
};

/**
 * TodoItem组件
 */
export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onComplete,
  onDelete,
  isAnimating = false
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理删除动画
  const handleDelete = (): void => {
    setIsDeleting(true);
    // 等待动画完成后执行删除
    setTimeout(() => {
      onDelete(todo.id);
    }, 200);
  };

  // 处理完成操作
  const handleComplete = (): void => {
    onComplete(todo.id);
  };

  // 处理键盘事件
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!todo.completed) {
        handleComplete();
      }
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      handleDelete();
    }
  };

  return (
    <TodoItemContainer
      ref={containerRef}
      completed={todo.completed}
      isAnimating={isAnimating}
      className={isDeleting ? 'deleting' : ''}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="listitem"
      aria-label={`待办事项: ${todo.text}${todo.completed ? ' (已完成)' : ' (未完成)'}`}
    >
      <TodoContent>
        <TodoText completed={todo.completed}>
          {todo.text}
        </TodoText>
        <TodoMeta>
          <StatusBadge completed={todo.completed}>
            {todo.completed ? '已完成' : '待完成'}
          </StatusBadge>
          <span>创建于 {formatDate(todo.createdAt)}</span>
          {todo.completedAt && (
            <span>完成于 {formatDate(todo.completedAt)}</span>
          )}
        </TodoMeta>
      </TodoContent>

      <ActionsContainer>
        {!todo.completed && (
          <ActionButton
            $variant="complete"
            onClick={handleComplete}
            aria-label={`完成待办事项: ${todo.text}`}
          >
            ✓ 完成
          </ActionButton>
        )}
        <ActionButton
          $variant="delete"
          onClick={handleDelete}
          aria-label={`删除待办事项: ${todo.text}`}
        >
          🗑 删除
        </ActionButton>
      </ActionsContainer>
    </TodoItemContainer>
  );
};

export default TodoItem;