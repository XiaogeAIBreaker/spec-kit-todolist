/**
 * React组件Props类型定义和主题配置
 */

import { TodoItem } from './todo';

// 组件Props接口定义
export interface TodoListProps {
  todos: TodoItem[];
  onAddTodo: (text: string) => void;
  onCompleteTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  isLoading?: boolean;
}

export interface TodoItemProps {
  todo: TodoItem;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isAnimating?: boolean;
}

export interface AddTodoFormProps {
  onSubmit: (text: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

export interface CompletionCelebrationProps {
  $show: boolean;
  todoText: string;
  onAnimationEnd: () => void;
  duration?: number; // 默认20秒
}

export interface EmptyStateProps {
  onAddFirst: () => void;
  message?: string;
}

// Hook接口定义
export interface UseTodosReturn {
  todos: TodoItem[];
  isLoading: boolean;
  celebrationQueue: string[];
  addTodo: (text: string) => Promise<void>;
  completeTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCelebration: (id: string) => void;
  error: Error | null;
}

// 表单验证相关
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// 动画配置
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

// 主题配置
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
  };
  animations: {
    completion: AnimationConfig;
    addItem: AnimationConfig;
    deleteItem: AnimationConfig;
    fadeIn: AnimationConfig;
    fadeOut: AnimationConfig;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

// 可访问性配置
export interface AccessibilityConfig {
  announceCompletion: boolean;
  announceAddition: boolean;
  announceDeletion: boolean;
  keyboardNavigation: boolean;
  screenReaderOptimized: boolean;
}

// 默认主题配置
export const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#6366f1',      // 活力紫
    secondary: '#ec4899',    // 活力粉
    success: '#10b981',      // 成功绿
    warning: '#f59e0b',      // 警告橙
    error: '#ef4444',        // 错误红
    background: '#ffffff',   // 背景白
    surface: '#f8fafc',      // 表面浅灰
    text: '#1f2937',         // 主文本深灰
    textSecondary: '#6b7280', // 次要文本中灰
    border: '#e5e7eb',       // 边框浅灰
    shadow: 'rgba(0, 0, 0, 0.1)' // 阴影
  },
  animations: {
    completion: {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay: 0
    },
    addItem: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay: 0
    },
    deleteItem: {
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay: 0
    },
    fadeIn: {
      duration: 200,
      easing: 'ease-in-out',
      delay: 0
    },
    fadeOut: {
      duration: 150,
      easing: 'ease-in-out',
      delay: 0
    }
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem'       // 32px
  },
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem'    // 12px
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  }
};

// 默认可访问性配置
export const defaultAccessibilityConfig: AccessibilityConfig = {
  announceCompletion: true,
  announceAddition: true,
  announceDeletion: true,
  keyboardNavigation: true,
  screenReaderOptimized: true
};

// 响应式断点
export const breakpoints = {
  mobile: '(max-width: 640px)',
  tablet: '(max-width: 768px)',
  desktop: '(min-width: 769px)'
} as const;

// 事件处理器类型
export type TodoEventHandler = (todoId: string) => void;
export type FormSubmitHandler = (text: string) => void;
export type AnimationEndHandler = () => void;