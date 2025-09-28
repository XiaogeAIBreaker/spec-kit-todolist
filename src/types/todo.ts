/**
 * Todo类型定义和验证
 */

export interface TodoItem {
  id: string;          // 唯一标识符 (UUID v4)
  text: string;        // 事项内容 (无长度限制)
  completed: boolean;  // 完成状态 (不可撤销)
  createdAt: Date;     // 创建时间 (用于排序)
  completedAt?: Date;  // 完成时间 (仅在completed=true时存在)
}

export interface TodoList {
  items: TodoItem[];
  lastModified: Date;
}

export interface TodoState {
  todos: TodoItem[];
  isLoading: boolean;
  celebrationQueue: string[]; // 待显示庆祝动画的todo id队列
}

export type TodoAction =
  | { type: 'LOAD_TODOS'; payload: TodoItem[] }
  | { type: 'ADD_TODO'; payload: { text: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'COMPLETE_TODO'; payload: { id: string } }
  | { type: 'SHOW_CELEBRATION'; payload: { id: string } }
  | { type: 'HIDE_CELEBRATION'; payload: { id: string } }
  | { type: 'SET_LOADING'; payload: boolean };

// 验证函数
export const validateTodoText = (text: string): { isValid: boolean; error?: string } => {
  const trimmed = text.trim();

  if (!trimmed) {
    return { isValid: false, error: '待办事项内容不能为空' };
  }

  return { isValid: true };
};

export const validateTodoItem = (todo: Partial<TodoItem>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!todo.id) {
    errors.push('缺少唯一标识符');
  }

  if (!todo.text || !todo.text.trim()) {
    errors.push('待办事项内容不能为空');
  }

  if (typeof todo.completed !== 'boolean') {
    errors.push('完成状态必须是布尔值');
  }

  if (!todo.createdAt || !(todo.createdAt instanceof Date)) {
    errors.push('创建时间必须是有效的日期');
  }

  if (todo.completed && !todo.completedAt) {
    errors.push('已完成的待办事项必须有完成时间');
  }

  if (!todo.completed && todo.completedAt) {
    errors.push('未完成的待办事项不应有完成时间');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// 工具函数
export const createTodoItem = (text: string): TodoItem => {
  const validation = validateTodoText(text);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: new Date()
  };
};

export const completeTodoItem = (todo: TodoItem): TodoItem => {
  if (todo.completed) {
    throw new Error('待办事项已经完成，无法重复完成');
  }

  return {
    ...todo,
    completed: true,
    completedAt: new Date()
  };
};

// 排序函数
export const sortTodosByCreatedDate = (todos: TodoItem[]): TodoItem[] => {
  return [...todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// 过滤函数
export const filterCompletedTodos = (todos: TodoItem[]): TodoItem[] => {
  return todos.filter(todo => todo.completed);
};

export const filterPendingTodos = (todos: TodoItem[]): TodoItem[] => {
  return todos.filter(todo => !todo.completed);
};