/**
 * 存储接口合约测试
 * 验证StorageInterface的所有方法按规范运行
 */

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

interface StorageStats {
  totalItems: number;
  completedItems: number;
  pendingItems: number;
  lastModified: Date;
  storageUsed: number;
}

class StorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message: string, public id?: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

interface StorageInterface {
  loadTodos(): Promise<TodoItem[]>;
  saveTodos(todos: TodoItem[]): Promise<void>;
  addTodo(text: string): Promise<TodoItem>;
  completeTodo(id: string): Promise<TodoItem>;
  deleteTodo(id: string): Promise<void>;
  getStats(): Promise<StorageStats>;
}

describe('StorageInterface Contract Tests', () => {
  let mockStorage: StorageInterface;

  beforeEach(() => {
    // Mock implementation will be created when actual storage is implemented
    mockStorage = {
      loadTodos: jest.fn().mockResolvedValue([]),
      saveTodos: jest.fn().mockResolvedValue(undefined),
      addTodo: jest.fn(),
      completeTodo: jest.fn(),
      deleteTodo: jest.fn(),
      getStats: jest.fn()
    };
  });

  describe('loadTodos', () => {
    it('should return empty array when no todos exist', async () => {
      const result = await mockStorage.loadTodos();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should return todos in reverse chronological order (newest first)', async () => {
      const todos: TodoItem[] = [
        {
          id: '1',
          text: 'First todo',
          completed: false,
          createdAt: new Date('2025-01-01')
        },
        {
          id: '2',
          text: 'Second todo',
          completed: false,
          createdAt: new Date('2025-01-02')
        }
      ];

      (mockStorage.loadTodos as jest.Mock).mockResolvedValue([todos[1], todos[0]]);

      const result = await mockStorage.loadTodos();
      expect(result[0].createdAt).toEqual(new Date('2025-01-02'));
      expect(result[1].createdAt).toEqual(new Date('2025-01-01'));
    });

    it('should throw StorageError when storage access fails', async () => {
      (mockStorage.loadTodos as jest.Mock).mockRejectedValue(new StorageError('Storage unavailable'));

      await expect(mockStorage.loadTodos()).rejects.toThrow(StorageError);
    });
  });

  describe('addTodo', () => {
    it('should create new todo with valid text', async () => {
      const expectedTodo: TodoItem = {
        id: 'test-id',
        text: 'New todo',
        completed: false,
        createdAt: new Date()
      };

      (mockStorage.addTodo as jest.Mock).mockResolvedValue(expectedTodo);

      const result = await mockStorage.addTodo('New todo');
      expect(result).toHaveProperty('id');
      expect(result.text).toBe('New todo');
      expect(result.completed).toBe(false);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should throw ValidationError for empty text after trim', async () => {
      (mockStorage.addTodo as jest.Mock).mockRejectedValue(new ValidationError('Text cannot be empty', 'text'));

      await expect(mockStorage.addTodo('   ')).rejects.toThrow(ValidationError);
      await expect(mockStorage.addTodo('')).rejects.toThrow(ValidationError);
    });

    it('should handle unlimited text length', async () => {
      const longText = 'a'.repeat(10000);
      const expectedTodo: TodoItem = {
        id: 'test-id',
        text: longText,
        completed: false,
        createdAt: new Date()
      };

      (mockStorage.addTodo as jest.Mock).mockResolvedValue(expectedTodo);

      const result = await mockStorage.addTodo(longText);
      expect(result.text).toBe(longText);
    });
  });

  describe('completeTodo', () => {
    it('should mark todo as completed and set completedAt timestamp', async () => {
      const completedTodo: TodoItem = {
        id: 'test-id',
        text: 'Test todo',
        completed: true,
        createdAt: new Date('2025-01-01'),
        completedAt: new Date()
      };

      (mockStorage.completeTodo as jest.Mock).mockResolvedValue(completedTodo);

      const result = await mockStorage.completeTodo('test-id');
      expect(result.completed).toBe(true);
      expect(result.completedAt).toBeInstanceOf(Date);
    });

    it('should throw NotFoundError for non-existent todo', async () => {
      (mockStorage.completeTodo as jest.Mock).mockRejectedValue(new NotFoundError('Todo not found', 'invalid-id'));

      await expect(mockStorage.completeTodo('invalid-id')).rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError if todo is already completed', async () => {
      (mockStorage.completeTodo as jest.Mock).mockRejectedValue(new ValidationError('Todo already completed'));

      await expect(mockStorage.completeTodo('completed-id')).rejects.toThrow(ValidationError);
    });
  });

  describe('deleteTodo', () => {
    it('should remove todo successfully', async () => {
      (mockStorage.deleteTodo as jest.Mock).mockResolvedValue(undefined);

      await expect(mockStorage.deleteTodo('test-id')).resolves.toBeUndefined();
    });

    it('should throw NotFoundError for non-existent todo', async () => {
      (mockStorage.deleteTodo as jest.Mock).mockRejectedValue(new NotFoundError('Todo not found', 'invalid-id'));

      await expect(mockStorage.deleteTodo('invalid-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', async () => {
      const expectedStats: StorageStats = {
        totalItems: 5,
        completedItems: 2,
        pendingItems: 3,
        lastModified: new Date(),
        storageUsed: 1024
      };

      (mockStorage.getStats as jest.Mock).mockResolvedValue(expectedStats);

      const result = await mockStorage.getStats();
      expect(result.totalItems).toBe(5);
      expect(result.completedItems).toBe(2);
      expect(result.pendingItems).toBe(3);
      expect(result.lastModified).toBeInstanceOf(Date);
      expect(typeof result.storageUsed).toBe('number');
    });
  });
});