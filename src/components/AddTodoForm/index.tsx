/**
 * AddTodoForm组件
 * 添加新待办事项的表单
 */

import React, { useState, useRef, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { AddTodoFormProps } from '@/types/components';
import { defaultTheme } from '@/types/components';
import { validateTodoText } from '@/types/todo';

// 动画定义
const focusGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
`;

const buttonPress = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
`;

const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
`;

// 样式组件
const FormContainer = styled.form<{ $hasError: boolean }>`
  display: flex;
  gap: ${defaultTheme.spacing.md};
  margin-bottom: ${defaultTheme.spacing.lg};
  padding: ${defaultTheme.spacing.lg};
  background: ${defaultTheme.colors.surface};
  border: 2px solid ${defaultTheme.colors.border};
  border-radius: ${defaultTheme.borderRadius.lg};
  box-shadow: ${defaultTheme.shadows.md};
  transition: all 0.3s ease-in-out;

  ${props => props.$hasError && css`
    border-color: ${defaultTheme.colors.error};
    animation: ${shake} 0.5s ease-in-out;
  `}

  &:focus-within {
    border-color: ${defaultTheme.colors.primary};
    box-shadow: ${defaultTheme.shadows.lg};
    background: ${defaultTheme.colors.background};
  }

  @media (max-width: 640px) {
    flex-direction: column;
    padding: ${defaultTheme.spacing.md};
  }
`;

const InputContainer = styled.div`
  flex: 1;
  position: relative;
`;

const TodoInput = styled.input<{ $hasError: boolean }>`
  width: 100%;
  padding: ${defaultTheme.spacing.md} ${defaultTheme.spacing.lg};
  border: 2px solid ${props => props.$hasError ? defaultTheme.colors.error : 'transparent'};
  border-radius: ${defaultTheme.borderRadius.md};
  font-size: 1rem;
  line-height: 1.5;
  color: ${defaultTheme.colors.text};
  background: ${defaultTheme.colors.background};
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;

  &::placeholder {
    color: ${defaultTheme.colors.textSecondary};
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    border-color: ${defaultTheme.colors.primary};
    animation: ${focusGlow} 0.6s ease-in-out;
  }

  &:disabled {
    background: #f3f4f6;
    color: ${defaultTheme.colors.textSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props => props.$hasError && css`
    background: rgba(239, 68, 68, 0.05);
  `}
`;

const ErrorMessage = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: ${defaultTheme.spacing.xs};
  padding: ${defaultTheme.spacing.sm} ${defaultTheme.spacing.md};
  background: ${defaultTheme.colors.error};
  color: white;
  font-size: 0.875rem;
  border-radius: ${defaultTheme.borderRadius.sm};
  box-shadow: ${defaultTheme.shadows.sm};
  transform: ${props => props.$show ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)'};
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  transition: all 0.2s ease-in-out;
  z-index: 10;

  &:before {
    content: '';
    position: absolute;
    top: -4px;
    left: ${defaultTheme.spacing.md};
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid ${defaultTheme.colors.error};
  }
`;

const CharacterCount = styled.div<{ $isNearLimit: boolean; $isOverLimit: boolean }>`
  position: absolute;
  bottom: ${defaultTheme.spacing.xs};
  right: ${defaultTheme.spacing.md};
  font-size: 0.75rem;
  color: ${props => {
    if (props.$isOverLimit) return defaultTheme.colors.error;
    if (props.$isNearLimit) return defaultTheme.colors.warning;
    return defaultTheme.colors.textSecondary;
  }};
  font-weight: ${props => props.$isNearLimit || props.$isOverLimit ? '600' : '400'};
  transition: all 0.2s ease-in-out;
`;

const SubmitButton = styled.button<{ $variant: 'primary' | 'loading' }>`
  padding: ${defaultTheme.spacing.md} ${defaultTheme.spacing.xl};
  border: none;
  border-radius: ${defaultTheme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: ${defaultTheme.spacing.sm};
  white-space: nowrap;
  min-width: 120px;
  justify-content: center;

  ${props => props.$variant === 'primary' && css`
    background: linear-gradient(135deg, ${defaultTheme.colors.primary} 0%, ${defaultTheme.colors.secondary} 100%);
    color: white;
    box-shadow: ${defaultTheme.shadows.sm};

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${defaultTheme.shadows.lg};
      background: linear-gradient(135deg, #5b5fb8 0%, #d63384 100%);
    }

    &:active {
      animation: ${buttonPress} 0.1s ease-in-out;
    }

    &:focus {
      outline: 2px solid ${defaultTheme.colors.primary};
      outline-offset: 2px;
    }
  `}

  ${props => props.$variant === 'loading' && css`
    background: ${defaultTheme.colors.textSecondary};
    color: white;
    cursor: not-allowed;
  `}

  &:disabled {
    background: ${defaultTheme.colors.textSecondary};
    color: white;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }

  @media (max-width: 640px) {
    padding: ${defaultTheme.spacing.md};
    min-width: 100%;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// 常量
const MAX_TODO_LENGTH = 200;
const NEAR_LIMIT_THRESHOLD = 0.8;

/**
 * AddTodoForm组件
 */
export const AddTodoForm: React.FC<AddTodoFormProps> = ({
  onSubmit,
  isDisabled = false,
  placeholder = '输入新的待办事项...'
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const characterCount = text.length;
  const isNearLimit = characterCount >= MAX_TODO_LENGTH * NEAR_LIMIT_THRESHOLD;
  const isOverLimit = characterCount > MAX_TODO_LENGTH;

  // 验证输入
  const validateInput = useCallback((value: string): string | null => {
    try {
      validateTodoText(value);
      if (value.length > MAX_TODO_LENGTH) {
        return `待办事项不能超过${MAX_TODO_LENGTH}个字符`;
      }
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : '输入无效';
    }
  }, []);

  // 处理输入变化
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setText(value);

    // 实时验证
    if (error && value.trim()) {
      const validationError = validateInput(value);
      if (!validationError) {
        setError(null);
      }
    }
  }, [error, validateInput]);

  // 处理表单提交
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    if (isDisabled || isSubmitting) {
      return;
    }

    const validationError = validateInput(text);
    if (validationError) {
      setError(validationError);
      inputRef.current?.focus();
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onSubmit(text.trim());

      // 清空输入
      setText('');
      inputRef.current?.focus();

    } catch (err) {
      setError(err instanceof Error ? err.message : '添加失败，请重试');
      inputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }, [text, isDisabled, isSubmitting, validateInput, onSubmit]);

  // 处理键盘事件
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event as any);
    } else if (event.key === 'Escape') {
      setText('');
      setError(null);
    }
  }, [handleSubmit]);

  // 处理输入失焦
  const handleBlur = useCallback(() => {
    if (text.trim()) {
      const validationError = validateInput(text);
      setError(validationError);
    }
  }, [text, validateInput]);

  const isFormDisabled = isDisabled || isSubmitting;
  const hasError = !!error;
  const canSubmit = text.trim() && !hasError && !isOverLimit && !isFormDisabled;

  return (
    <FormContainer
      onSubmit={handleSubmit}
      $hasError={hasError}
      role="form"
      aria-label="添加新待办事项"
    >
      <InputContainer>
        <TodoInput
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={isFormDisabled}
          $hasError={hasError}
          maxLength={MAX_TODO_LENGTH + 50} // 允许稍微超出以便显示错误
          aria-label="待办事项内容"
          aria-invalid={hasError}
          aria-describedby={error ? 'todo-error' : undefined}
        />

        <CharacterCount
          $isNearLimit={isNearLimit}
          $isOverLimit={isOverLimit}
          aria-label={`已输入 ${characterCount} 个字符，最多 ${MAX_TODO_LENGTH} 个字符`}
        >
          {characterCount}/{MAX_TODO_LENGTH}
        </CharacterCount>

        <ErrorMessage
          id="todo-error"
          $show={hasError}
          role="alert"
          aria-live="polite"
        >
          {error}
        </ErrorMessage>
      </InputContainer>

      <SubmitButton
        type="submit"
        disabled={!canSubmit}
        $variant={isSubmitting ? 'loading' : 'primary'}
        aria-label={isSubmitting ? '正在添加...' : '添加待办事项'}
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner />
            添加中...
          </>
        ) : (
          <>
            ✨ 添加
          </>
        )}
      </SubmitButton>
    </FormContainer>
  );
};

export default AddTodoForm;