/**
 * 本地存储接口合约
 * 定义TodoList应用的数据持久化接口
 */

export interface StorageInterface {
  /**
   * 加载所有待办事项
   * @returns Promise<TodoItem[]> 待办事项列表，按创建时间倒序
   * @throws StorageError 当存储访问失败时
   */
  loadTodos(): Promise<TodoItem[]>;

  /**
   * 保存待办事项列表
   * @param todos 要保存的待办事项列表
   * @throws StorageError 当存储写入失败时
   */
  saveTodos(todos: TodoItem[]): Promise<void>;

  /**
   * 添加新的待办事项
   * @param text 待办事项内容（trim后不能为空）
   * @returns Promise<TodoItem> 新创建的待办事项
   * @throws ValidationError 当文本内容无效时
   * @throws StorageError 当存储操作失败时
   */
  addTodo(text: string): Promise<TodoItem>;

  /**
   * 标记待办事项为已完成
   * @param id 待办事项ID
   * @returns Promise<TodoItem> 更新后的待办事项
   * @throws NotFoundError 当ID不存在时
   * @throws ValidationError 当项目已经完成时
   * @throws StorageError 当存储操作失败时
   */
  completeTodo(id: string): Promise<TodoItem>;

  /**
   * 删除待办事项
   * @param id 待办事项ID
   * @throws NotFoundError 当ID不存在时
   * @throws StorageError 当存储操作失败时
   */
  deleteTodo(id: string): Promise<void>;

  /**
   * 获取存储统计信息
   * @returns Promise<StorageStats> 存储统计数据
   */
  getStats(): Promise<StorageStats>;
}

export interface StorageStats {
  totalItems: number;
  completedItems: number;
  pendingItems: number;
  lastModified: Date;
  storageUsed: number; // bytes
}

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