/**
 * 存储相关类型定义和错误处理
 */

import { TodoItem } from './todo';

export interface StorageData {
  version: string;     // 数据格式版本 (当前: "1.0")
  todos: TodoItem[];   // 所有待办事项
  metadata: {
    lastModified: string;  // ISO 8601格式
    totalCreated: number;  // 累计创建数量
    totalCompleted: number; // 累计完成数量
  };
}

export interface StorageStats {
  totalItems: number;
  completedItems: number;
  pendingItems: number;
  lastModified: Date;
  storageUsed: number; // bytes
}

// 存储接口定义
export interface StorageInterface {
  loadTodos(): Promise<TodoItem[]>;
  saveTodos(todos: TodoItem[]): Promise<void>;
  addTodo(text: string): Promise<TodoItem>;
  completeTodo(id: string): Promise<TodoItem>;
  deleteTodo(id: string): Promise<void>;
  getStats(): Promise<StorageStats>;
}

// 错误类定义
export class StorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string, public id?: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// 存储配置
export const STORAGE_CONFIG = {
  STORAGE_KEY: 'todolist-data',
  CURRENT_VERSION: '1.0',
  MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB
  BACKUP_KEY: 'todolist-backup'
} as const;

// 序列化/反序列化辅助函数
export const serializeTodos = (todos: TodoItem[]): string => {
  const data: StorageData = {
    version: STORAGE_CONFIG.CURRENT_VERSION,
    todos: todos.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      completedAt: todo.completedAt?.toISOString()
    })) as any,
    metadata: {
      lastModified: new Date().toISOString(),
      totalCreated: todos.length,
      totalCompleted: todos.filter(t => t.completed).length
    }
  };

  return JSON.stringify(data);
};

export const deserializeTodos = (dataString: string): TodoItem[] => {
  try {
    const data: StorageData = JSON.parse(dataString);

    // 版本检查
    if (data.version !== STORAGE_CONFIG.CURRENT_VERSION) {
      console.warn(`Storage version mismatch: expected ${STORAGE_CONFIG.CURRENT_VERSION}, got ${data.version}`);
    }

    // 反序列化todos
    return data.todos.map(todo => ({
      ...todo,
      createdAt: new Date(todo.createdAt as any),
      completedAt: todo.completedAt ? new Date(todo.completedAt as any) : undefined
    }));
  } catch (error) {
    throw new StorageError('Failed to deserialize todos data', error as Error);
  }
};

// 存储容量检查
export const checkStorageCapacity = (dataSize: number): boolean => {
  return dataSize <= STORAGE_CONFIG.MAX_STORAGE_SIZE;
};

// 计算存储使用量
export const calculateStorageUsage = (data: string): number => {
  return new Blob([data]).size;
};