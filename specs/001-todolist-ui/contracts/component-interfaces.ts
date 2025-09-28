/**
 * React组件接口合约
 * 定义TodoList应用各组件的props和回调接口
 */

// TodoItem interface from data-model.md
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * TodoList主组件接口
 */
export interface TodoListProps {
  todos: TodoItem[];
  onAddTodo: (text: string) => void;
  onCompleteTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  isLoading?: boolean;
}

/**
 * 单个待办事项组件接口
 */
export interface TodoItemProps {
  todo: TodoItem;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isAnimating?: boolean;
}

/**
 * 添加待办事项表单组件接口
 */
export interface AddTodoFormProps {
  onSubmit: (text: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

/**
 * 完成庆祝动画组件接口
 */
export interface CompletionCelebrationProps {
  show: boolean;
  todoText: string;
  onAnimationEnd: () => void;
  duration?: number; // 默认20秒
}

/**
 * 空状态组件接口
 */
export interface EmptyStateProps {
  onAddFirst: () => void;
  message?: string;
}

/**
 * 状态管理Hook接口
 */
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

/**
 * 表单验证接口
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * 动画配置接口
 */
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

/**
 * 主题配置接口
 */
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
  };
  animations: {
    completion: AnimationConfig;
    addItem: AnimationConfig;
    deleteItem: AnimationConfig;
  };
}

/**
 * 可访问性配置接口
 */
export interface AccessibilityConfig {
  announceCompletion: boolean;
  announceAddition: boolean;
  announceDeletion: boolean;
  keyboardNavigation: boolean;
  screenReaderOptimized: boolean;
}