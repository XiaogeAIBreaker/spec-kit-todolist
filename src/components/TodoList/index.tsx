/**
 * TodoList组件
 * 待办事项列表的容器组件
 */

import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { TodoListProps } from '@/types/components';
import { defaultTheme } from '@/types/components';
import TodoItem from '@/components/TodoItem';
import EmptyState from '@/components/EmptyState';
import { GlassBox } from '@/components/GlassBox';

// 动画定义
const listEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const loadingPulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const staggerDelay = (index: number) => css`
  animation-delay: ${index * 0.05}s;
`;

// 样式组件
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.spacing.md};
  min-height: 200px;
  animation: ${listEnter} 0.4s ease-out;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${defaultTheme.spacing.lg};
  padding: 0 ${defaultTheme.spacing.sm};
`;

const TodoCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.spacing.md};
  font-size: 0.875rem;
  color: ${defaultTheme.colors.textSecondary};
`;

const CountBadge = styled.span<{ $variant: 'total' | 'completed' | 'pending' }>`
  display: inline-flex;
  align-items: center;
  padding: ${defaultTheme.spacing.xs} ${defaultTheme.spacing.sm};
  border-radius: ${defaultTheme.borderRadius.sm};
  font-weight: 600;
  font-size: 0.75rem;

  ${props => props.$variant === 'total' && css`
    background: ${defaultTheme.colors.primary};
    color: white;
  `}

  ${props => props.$variant === 'completed' && css`
    background: ${defaultTheme.colors.success};
    color: white;
  `}

  ${props => props.$variant === 'pending' && css`
    background: ${defaultTheme.colors.warning};
    color: white;
  `}
`;

const FilterTabs = styled.div`
  display: flex;
  gap: ${defaultTheme.spacing.xs};
  background: ${defaultTheme.colors.surface};
  border-radius: ${defaultTheme.borderRadius.md};
  padding: ${defaultTheme.spacing.xs};
  box-shadow: ${defaultTheme.shadows.sm};
`;

const FilterTab = styled.button<{ active: boolean }>`
  padding: ${defaultTheme.spacing.sm} ${defaultTheme.spacing.md};
  border: none;
  border-radius: ${defaultTheme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  ${props => props.active ? css`
    background: ${defaultTheme.colors.primary};
    color: white;
    box-shadow: ${defaultTheme.shadows.sm};
  ` : css`
    background: transparent;
    color: ${defaultTheme.colors.textSecondary};

    &:hover {
      background: rgba(99, 102, 241, 0.1);
      color: ${defaultTheme.colors.primary};
    }
  `}

  &:focus {
    outline: 2px solid ${defaultTheme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    padding: ${defaultTheme.spacing.xs} ${defaultTheme.spacing.sm};
    font-size: 0.75rem;
  }
`;

const TodoItemsList = styled.div<{ $isEmpty: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.spacing.md};
  min-height: ${props => props.$isEmpty ? '300px' : 'auto'};
  position: relative;
`;

const TodoItemWrapper = styled.div<{ $index: number; $isAnimating: boolean }>`
  animation: ${listEnter} 0.3s ease-out forwards;
  ${props => staggerDelay(props.$index)}
  opacity: 0;

  ${props => props.$isAnimating && css`
    z-index: 10;
  `}
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${defaultTheme.spacing.md};
  padding: ${defaultTheme.spacing.lg};
`;

const LoadingSkeleton = styled.div`
  height: 80px;
  background: linear-gradient(90deg,
    ${defaultTheme.colors.surface} 25%,
    rgba(255, 255, 255, 0.8) 50%,
    ${defaultTheme.colors.surface} 75%
  );
  background-size: 200% 100%;
  border-radius: ${defaultTheme.borderRadius.md};
  animation: ${loadingPulse} 1.5s ease-in-out infinite;
`;

const ProgressBar = styled.div`
  margin-top: ${defaultTheme.spacing.lg};
  padding: 0 ${defaultTheme.spacing.sm};
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 8px;
  background: ${defaultTheme.colors.surface};
  border-radius: ${defaultTheme.borderRadius.sm};
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: linear-gradient(90deg, ${defaultTheme.colors.success} 0%, ${defaultTheme.colors.primary} 100%);
  transition: width 0.5s ease-in-out;
  border-radius: ${defaultTheme.borderRadius.sm};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
    animation: shimmer 2s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${defaultTheme.spacing.sm};
  font-size: 0.75rem;
  color: ${defaultTheme.colors.textSecondary};
`;

// 过滤器类型
type FilterType = 'all' | 'pending' | 'completed';

/**
 * TodoList组件
 */
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onAddTodo,
  onCompleteTodo,
  onDeleteTodo,
  isLoading = false
}) => {
  const [filter, setFilter] = React.useState<FilterType>('all');
  const [animatingItems, setAnimatingItems] = React.useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);

  // 过滤待办事项
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'pending':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  // 统计信息
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionPercentage };
  }, [todos]);

  // 处理完成操作
  const handleComplete = useCallback((id: string) => {
    setAnimatingItems(prev => new Set(prev).add(id));

    // 添加短暂延迟以显示动画
    setTimeout(() => {
      onCompleteTodo(id);
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 100);
  }, [onCompleteTodo]);

  // 处理删除操作
  const handleDelete = useCallback((id: string) => {
    onDeleteTodo(id);
  }, [onDeleteTodo]);

  // 处理过滤器变化
  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  // 处理空状态的添加操作
  const handleEmptyStateAdd = useCallback(() => {
    // 聚焦到添加表单（需要父组件传递聚焦函数或通过事件）
    const addButton = document.querySelector('[aria-label*="添加"]') as HTMLElement;
    if (addButton) {
      addButton.focus();
    }
  }, []);

  // 键盘导航
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const todoItems = listRef.current?.querySelectorAll('[role="listitem"]');
      if (!todoItems || todoItems.length === 0) return;

      const currentIndex = Array.from(todoItems).indexOf(event.target as Element);
      const nextIndex = event.key === 'ArrowDown'
        ? Math.min(currentIndex + 1, todoItems.length - 1)
        : Math.max(currentIndex - 1, 0);

      (todoItems[nextIndex] as HTMLElement)?.focus();
    }
  }, []);

  // 滚动到新添加的项目
  useEffect(() => {
    if (todos.length > 0 && filter === 'all') {
      const latestTodo = todos[0]; // 假设新项目在开头
      const todoElement = document.querySelector(`[data-todo-id="${latestTodo.id}"]`);
      if (todoElement) {
        todoElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [todos.length, filter]);

  if (isLoading) {
    return (
      <ListContainer>
        <LoadingState>
          {Array.from({ length: 3 }, (_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </LoadingState>
      </ListContainer>
    );
  }

  const isEmpty = filteredTodos.length === 0;

  return (
    <ListContainer>
      {todos.length > 0 && (
        <>
          <ListHeader>
            <TodoCount>
              <CountBadge $variant="total">
                总计 {stats.total}
              </CountBadge>
              <CountBadge $variant="completed">
                已完成 {stats.completed}
              </CountBadge>
              <CountBadge $variant="pending">
                待完成 {stats.pending}
              </CountBadge>
            </TodoCount>

            <FilterTabs role="tablist" aria-label="过滤待办事项">
              <FilterTab
                role="tab"
                active={filter === 'all'}
                onClick={() => handleFilterChange('all')}
                aria-selected={filter === 'all'}
                aria-controls="todo-list"
              >
                全部
              </FilterTab>
              <FilterTab
                role="tab"
                active={filter === 'pending'}
                onClick={() => handleFilterChange('pending')}
                aria-selected={filter === 'pending'}
                aria-controls="todo-list"
              >
                待完成
              </FilterTab>
              <FilterTab
                role="tab"
                active={filter === 'completed'}
                onClick={() => handleFilterChange('completed')}
                aria-selected={filter === 'completed'}
                aria-controls="todo-list"
              >
                已完成
              </FilterTab>
            </FilterTabs>
          </ListHeader>

          {stats.total > 0 && (
            <ProgressBar>
              <ProgressContainer>
                <ProgressFill $percentage={stats.completionPercentage} />
              </ProgressContainer>
              <ProgressLabel>
                <span>完成进度</span>
                <span>{stats.completionPercentage}% ({stats.completed}/{stats.total})</span>
              </ProgressLabel>
            </ProgressBar>
          )}
        </>
      )}

      <TodoItemsList
        ref={listRef}
        $isEmpty={isEmpty}
        onKeyDown={handleKeyDown}
        role="list"
        id="todo-list"
        aria-label={`待办事项列表，当前显示${filter === 'all' ? '全部' : filter === 'pending' ? '待完成' : '已完成'}项目`}
      >
        {isEmpty ? (
          <EmptyState
            onAddFirst={handleEmptyStateAdd}
            message={filter === 'all'
              ? "还没有待办事项，添加第一个吧！"
              : filter === 'pending'
                ? "太棒了！没有待完成的事项"
                : "还没有完成任何事项"
            }
          />
        ) : (
          filteredTodos.map((todo, index) => (
            <TodoItemWrapper
              key={todo.id}
              $index={index}
              $isAnimating={animatingItems.has(todo.id)}
              data-todo-id={todo.id}
            >
              <TodoItem
                todo={todo}
                onComplete={handleComplete}
                onDelete={handleDelete}
                isAnimating={animatingItems.has(todo.id)}
              />
            </TodoItemWrapper>
          ))
        )}
      </TodoItemsList>
    </ListContainer>
  );
};

export default TodoList;