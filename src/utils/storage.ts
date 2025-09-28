/**
 * LocalStorage实现
 * 实现TodoList的数据持久化
 */

import { TodoItem, createTodoItem, completeTodoItem } from '@/types/todo';
import {
  StorageInterface,
  StorageStats,
  StorageError,
  ValidationError,
  NotFoundError,
  STORAGE_CONFIG,
  serializeTodos,
  deserializeTodos,
  checkStorageCapacity,
  calculateStorageUsage
} from '@/types/storage';

export class LocalStorageService implements StorageInterface {
  private storageKey = STORAGE_CONFIG.STORAGE_KEY;
  private backupKey = STORAGE_CONFIG.BACKUP_KEY;

  /**
   * 加载所有待办事项
   */
  async loadTodos(): Promise<TodoItem[]> {
    try {
      const data = localStorage.getItem(this.storageKey);

      if (!data) {
        return [];
      }

      return deserializeTodos(data);
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);

      // 尝试从备份恢复
      try {
        const backupData = localStorage.getItem(this.backupKey);
        if (backupData) {
          console.log('Attempting to restore from backup...');
          return deserializeTodos(backupData);
        }
      } catch (backupError) {
        console.error('Backup restoration also failed:', backupError);
      }

      throw new StorageError('无法加载待办事项数据', error as Error);
    }
  }

  /**
   * 保存待办事项列表
   */
  async saveTodos(todos: TodoItem[]): Promise<void> {
    try {
      const serializedData = serializeTodos(todos);
      const dataSize = calculateStorageUsage(serializedData);

      // 检查存储容量
      if (!checkStorageCapacity(dataSize)) {
        throw new StorageError(`数据大小 (${dataSize} bytes) 超过最大限制 (${STORAGE_CONFIG.MAX_STORAGE_SIZE} bytes)`);
      }

      // 创建备份
      const currentData = localStorage.getItem(this.storageKey);
      if (currentData) {
        localStorage.setItem(this.backupKey, currentData);
      }

      // 保存新数据
      localStorage.setItem(this.storageKey, serializedData);
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError('保存待办事项失败', error as Error);
    }
  }

  /**
   * 添加新的待办事项
   */
  async addTodo(text: string): Promise<TodoItem> {
    try {
      const newTodo = createTodoItem(text);
      const existingTodos = await this.loadTodos();
      const updatedTodos = [newTodo, ...existingTodos];

      await this.saveTodos(updatedTodos);
      return newTodo;
    } catch (error) {
      if (error instanceof Error && error.message.includes('待办事项内容不能为空')) {
        throw new ValidationError(error.message, 'text');
      }
      throw new StorageError('添加待办事项失败', error as Error);
    }
  }

  /**
   * 标记待办事项为已完成
   */
  async completeTodo(id: string): Promise<TodoItem> {
    try {
      const todos = await this.loadTodos();
      const todoIndex = todos.findIndex(todo => todo.id === id);

      if (todoIndex === -1) {
        throw new NotFoundError(`待办事项未找到: ${id}`, id);
      }

      const todo = todos[todoIndex];

      if (todo.completed) {
        throw new ValidationError('待办事项已经完成，无法重复完成');
      }

      const completedTodo = completeTodoItem(todo);
      todos[todoIndex] = completedTodo;

      await this.saveTodos(todos);
      return completedTodo;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new StorageError('完成待办事项失败', error as Error);
    }
  }

  /**
   * 删除待办事项
   */
  async deleteTodo(id: string): Promise<void> {
    try {
      const todos = await this.loadTodos();
      const todoIndex = todos.findIndex(todo => todo.id === id);

      if (todoIndex === -1) {
        throw new NotFoundError(`待办事项未找到: ${id}`, id);
      }

      todos.splice(todoIndex, 1);
      await this.saveTodos(todos);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError('删除待办事项失败', error as Error);
    }
  }

  /**
   * 获取存储统计信息
   */
  async getStats(): Promise<StorageStats> {
    try {
      const todos = await this.loadTodos();
      const data = localStorage.getItem(this.storageKey);
      const storageUsed = data ? calculateStorageUsage(data) : 0;

      return {
        totalItems: todos.length,
        completedItems: todos.filter(todo => todo.completed).length,
        pendingItems: todos.filter(todo => !todo.completed).length,
        lastModified: new Date(),
        storageUsed
      };
    } catch (error) {
      throw new StorageError('获取统计信息失败', error as Error);
    }
  }

  /**
   * 清除所有数据
   */
  async clearAll(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.backupKey);
    } catch (error) {
      throw new StorageError('清除数据失败', error as Error);
    }
  }

  /**
   * 导出数据
   */
  async exportData(): Promise<string> {
    try {
      const todos = await this.loadTodos();
      return serializeTodos(todos);
    } catch (error) {
      throw new StorageError('导出数据失败', error as Error);
    }
  }

  /**
   * 导入数据
   */
  async importData(dataString: string): Promise<void> {
    try {
      const todos = deserializeTodos(dataString);
      await this.saveTodos(todos);
    } catch (error) {
      throw new StorageError('导入数据失败', error as Error);
    }
  }

  /**
   * 检查存储是否可用
   */
  static isStorageAvailable(): boolean {
    try {
      const testKey = 'storage-test';
      const testValue = 'test';
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return retrieved === testValue;
    } catch {
      return false;
    }
  }
}

// 创建默认实例
export const storageService = new LocalStorageService();

// 存储监听器类型
export type StorageChangeListener = (todos: TodoItem[]) => void;

// 存储事件管理器
export class StorageEventManager {
  private listeners: Set<StorageChangeListener> = new Set();

  addListener(listener: StorageChangeListener): void {
    this.listeners.add(listener);
  }

  removeListener(listener: StorageChangeListener): void {
    this.listeners.delete(listener);
  }

  notifyListeners(todos: TodoItem[]): void {
    this.listeners.forEach(listener => {
      try {
        listener(todos);
      } catch (error) {
        console.error('Storage listener error:', error);
      }
    });
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const storageEventManager = new StorageEventManager();