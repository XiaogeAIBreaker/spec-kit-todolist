/**
 * TodoApp主应用组件
 * 整合所有组件的主容器
 */

import React, { useCallback, useEffect, useState, useRef } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { defaultTheme } from '@/types/components';
import { useTodos } from '@/hooks/useTodos';
import AddTodoForm from '@/components/AddTodoForm';
import TodoList from '@/components/TodoList';
import CompletionCelebration from '@/components/CompletionCelebration';

// 全局样式
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: ${defaultTheme.colors.text};
  }

  #__next {
    min-height: 100vh;
  }

  /* 可访问性改进 */
  :focus-visible {
    outline: 2px solid ${defaultTheme.colors.primary};
    outline-offset: 2px;
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${defaultTheme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${defaultTheme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${defaultTheme.colors.textSecondary};
  }

  /* 选择文本样式 */
  ::selection {
    background: rgba(99, 102, 241, 0.2);
    color: ${defaultTheme.colors.text};
  }

  /* 减少动画的用户偏好设置 */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// 动画定义
const appEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const headerGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(99, 102, 241, 0.6), 0 0 30px rgba(236, 72, 153, 0.4);
  }
`;

// 样式组件
const AppContainer = styled.div`
  min-height: 100vh;
  padding: ${defaultTheme.spacing.xl} ${defaultTheme.spacing.lg};
  animation: ${appEnter} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: ${defaultTheme.spacing.lg} ${defaultTheme.spacing.md};
  }
`;

const AppContent = styled.main`
  max-width: 800px;
  margin: 0 auto;
  background: ${defaultTheme.colors.background};
  border-radius: ${defaultTheme.borderRadius.lg};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const AppHeader = styled.header`
  padding: ${defaultTheme.spacing.xl} ${defaultTheme.spacing.xl} ${defaultTheme.spacing.lg};
  background: linear-gradient(135deg, ${defaultTheme.colors.primary} 0%, ${defaultTheme.colors.secondary} 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @media (max-width: 768px) {
    padding: ${defaultTheme.spacing.lg} ${defaultTheme.spacing.lg} ${defaultTheme.spacing.md};
  }
`;

const AppTitle = styled.h1`
  margin: 0 0 ${defaultTheme.spacing.sm} 0;
  font-size: 2.5rem;
  font-weight: 700;
  animation: ${headerGlow} 3s ease-in-out infinite;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const AppSubtitle = styled.p`
  margin: 0;
  font-size: 1.125rem;
  opacity: 0.9;
  font-weight: 400;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AppBody = styled.div`
  padding: ${defaultTheme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${defaultTheme.spacing.lg};
  }

  @media (max-width: 480px) {
    padding: ${defaultTheme.spacing.md};
  }
`;

const ErrorBoundary = styled.div`
  padding: ${defaultTheme.spacing.xl};
  text-align: center;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid ${defaultTheme.colors.error};
  border-radius: ${defaultTheme.borderRadius.md};
  margin: ${defaultTheme.spacing.lg} 0;
`;

const ErrorTitle = styled.h3`
  color: ${defaultTheme.colors.error};
  margin: 0 0 ${defaultTheme.spacing.md} 0;
`;

const ErrorMessage = styled.p`
  color: ${defaultTheme.colors.textSecondary};
  margin: 0 0 ${defaultTheme.spacing.lg} 0;
`;

const RetryButton = styled.button`
  padding: ${defaultTheme.spacing.md} ${defaultTheme.spacing.lg};
  background: ${defaultTheme.colors.error};
  color: white;
  border: none;
  border-radius: ${defaultTheme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid ${defaultTheme.colors.error};
    outline-offset: 2px;
  }
`;

const LoadingOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(4px);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

/**
 * TodoApp主应用组件
 */
export const TodoApp: React.FC = () => {
  const {
    todos,
    isLoading,
    celebrationQueue,
    addTodo,
    completeTodo,
    deleteTodo,
    clearCelebration,
    error
  } = useTodos();

  const [appError, setAppError] = useState<Error | null>(null);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const celebrationData = useRef<{ id: string; text: string } | null>(null);

  // 错误边界处理
  useEffect(() => {
    if (error) {
      setAppError(error);
    }
  }, [error]);

  // 监听庆祝队列变化
  useEffect(() => {
    if (celebrationQueue.length > 0) {
      const celebratingId = celebrationQueue[0];
      const celebratingTodo = todos.find(todo => todo.id === celebratingId);

      if (celebratingTodo) {
        celebrationData.current = {
          id: celebratingTodo.id,
          text: celebratingTodo.text
        };
      }
    } else {
      celebrationData.current = null;
    }
  }, [celebrationQueue, todos]);

  // 处理添加待办事项
  const handleAddTodo = useCallback(async (text: string) => {
    try {
      setIsOperationLoading(true);
      setAppError(null);
      await addTodo(text);
    } catch (err) {
      setAppError(err as Error);
      throw err; // 重新抛出以便表单处理
    } finally {
      setIsOperationLoading(false);
    }
  }, [addTodo]);

  // 处理完成待办事项
  const handleCompleteTodo = useCallback(async (id: string) => {
    try {
      setIsOperationLoading(true);
      setAppError(null);
      await completeTodo(id);
    } catch (err) {
      setAppError(err as Error);
    } finally {
      setIsOperationLoading(false);
    }
  }, [completeTodo]);

  // 处理删除待办事项
  const handleDeleteTodo = useCallback(async (id: string) => {
    try {
      setIsOperationLoading(true);
      setAppError(null);
      await deleteTodo(id);
    } catch (err) {
      setAppError(err as Error);
    } finally {
      setIsOperationLoading(false);
    }
  }, [deleteTodo]);

  // 处理庆祝动画结束
  const handleCelebrationEnd = useCallback(() => {
    if (celebrationData.current) {
      clearCelebration(celebrationData.current.id);
    }
  }, [clearCelebration]);

  // 重试错误操作
  const handleRetry = useCallback(() => {
    setAppError(null);
    window.location.reload();
  }, []);

  // 键盘快捷键
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // 全局键盘快捷键可以在这里处理
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'r':
          event.preventDefault();
          window.location.reload();
          break;
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <AppContent>
          <AppHeader>
            <AppTitle>✨ 待办清单</AppTitle>
            <AppSubtitle>让每一天都充满成就感</AppSubtitle>
          </AppHeader>

          <AppBody>
            {appError && (
              <ErrorBoundary>
                <ErrorTitle>😵 出错了</ErrorTitle>
                <ErrorMessage>
                  {appError.message || '发生了未知错误，请重试'}
                </ErrorMessage>
                <RetryButton onClick={handleRetry}>
                  重新加载
                </RetryButton>
              </ErrorBoundary>
            )}

            <AddTodoForm
              onSubmit={handleAddTodo}
              isDisabled={isLoading || isOperationLoading}
              placeholder="输入新的待办事项... (按 Enter 提交)"
            />

            <TodoList
              todos={todos}
              onAddTodo={handleAddTodo}
              onCompleteTodo={handleCompleteTodo}
              onDeleteTodo={handleDeleteTodo}
              isLoading={isLoading}
            />
          </AppBody>
        </AppContent>

        {/* 加载覆盖层 */}
        <LoadingOverlay $show={isOperationLoading}>
          <LoadingSpinner />
        </LoadingOverlay>

        {/* 庆祝动画 */}
        {celebrationData.current && (
          <CompletionCelebration
            $show={celebrationQueue.length > 0}
            todoText={celebrationData.current.text}
            onAnimationEnd={handleCelebrationEnd}
            duration={20000}
          />
        )}
      </AppContainer>
    </>
  );
};

export default TodoApp;