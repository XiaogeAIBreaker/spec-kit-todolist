/**
 * 数据持久化集成测试
 * 验证数据在浏览器刷新和重新访问时的持久化
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock localStorage for testing
const createMockStorage = () => {
  let storage: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => storage[key] || null),
    setItem: jest.fn((key: string, value: string) => { storage[key] = value; }),
    removeItem: jest.fn((key: string) => { delete storage[key]; }),
    clear: jest.fn(() => { storage = {}; }),
    get storage() { return storage; }
  };
};

// Mock app with persistence
const MockPersistentApp = () => {
  const [todos, setTodos] = React.useState<Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: Date;
    completedAt?: Date;
  }>>([]);

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('todolist-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const loadedTodos = data.todos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined
        }));
        setTodos(loadedTodos);
      } catch (error) {
        console.error('Failed to load todos:', error);
      }
    }
  }, []);

  // Save to localStorage when todos change
  React.useEffect(() => {
    const data = {
      version: '1.0',
      todos: todos,
      metadata: {
        lastModified: new Date().toISOString(),
        totalCreated: todos.length,
        totalCompleted: todos.filter(t => t.completed).length
      }
    };
    localStorage.setItem('todolist-data', JSON.stringify(data));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const completeTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, completed: true, completedAt: new Date() }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div data-testid="persistent-app">
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const text = formData.get('todoText') as string;
        if (text?.trim()) {
          addTodo(text);
          (e.target as HTMLFormElement).reset();
        }
      }}>
        <input name="todoText" data-testid="todo-input" placeholder="Add todo..." />
        <button type="submit" data-testid="add-btn">Add</button>
      </form>

      <div data-testid="todo-list">
        {todos.map(todo => (
          <div key={todo.id} data-testid={`todo-${todo.id}`}>
            <span>{todo.text}</span>
            <span data-testid={`status-${todo.id}`}>
              {todo.completed ? 'Completed' : 'Pending'}
            </span>
            {!todo.completed && (
              <button onClick={() => completeTodo(todo.id)} data-testid={`complete-${todo.id}`}>
                Complete
              </button>
            )}
            <button onClick={() => deleteTodo(todo.id)} data-testid={`delete-${todo.id}`}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div data-testid="storage-info">
        Stored: {todos.length} todos
      </div>
    </div>
  );
};

describe('Data Persistence Integration Tests', () => {
  let mockStorage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    mockStorage = createMockStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    });

    let uuidCounter = 0;
    global.crypto.randomUUID = jest.fn(() => `test-uuid-${++uuidCounter}`);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Load from Storage', () => {
    it('should load empty state when no data exists', () => {
      render(<MockPersistentApp />);

      expect(screen.getByTestId('storage-info')).toHaveTextContent('Stored: 0 todos');
      expect(mockStorage.getItem).toHaveBeenCalledWith('todolist-data');
    });

    it('should load existing todos from localStorage', () => {
      // Pre-populate localStorage
      const existingData = {
        version: '1.0',
        todos: [
          {
            id: 'existing-1',
            text: '现有Todo',
            completed: false,
            createdAt: '2025-01-01T10:00:00.000Z'
          },
          {
            id: 'existing-2',
            text: '已完成Todo',
            completed: true,
            createdAt: '2025-01-01T09:00:00.000Z',
            completedAt: '2025-01-01T11:00:00.000Z'
          }
        ],
        metadata: {
          lastModified: '2025-01-01T11:00:00.000Z',
          totalCreated: 2,
          totalCompleted: 1
        }
      };

      mockStorage.setItem('todolist-data', JSON.stringify(existingData));

      render(<MockPersistentApp />);

      // Verify todos are loaded
      expect(screen.getByTestId('todo-existing-1')).toBeInTheDocument();
      expect(screen.getByTestId('todo-existing-2')).toBeInTheDocument();
      expect(screen.getByText('现有Todo')).toBeInTheDocument();
      expect(screen.getByText('已完成Todo')).toBeInTheDocument();

      // Verify states
      expect(screen.getByTestId('status-existing-1')).toHaveTextContent('Pending');
      expect(screen.getByTestId('status-existing-2')).toHaveTextContent('Completed');

      expect(screen.getByTestId('storage-info')).toHaveTextContent('Stored: 2 todos');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      // Set invalid JSON
      mockStorage.setItem('todolist-data', 'invalid-json');

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<MockPersistentApp />);

      // Should fallback to empty state
      expect(screen.getByTestId('storage-info')).toHaveTextContent('Stored: 0 todos');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load todos:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('Saving to Storage', () => {
    it('should save new todos to localStorage', async () => {
      render(<MockPersistentApp />);

      await userEvent.type(screen.getByTestId('todo-input'), '新Todo');
      await userEvent.click(screen.getByTestId('add-btn'));

      // Verify saved to localStorage
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'todolist-data',
        expect.stringContaining('新Todo')
      );

      // Parse and verify the saved data
      const lastCall = mockStorage.setItem.mock.calls.slice(-1)[0];
      const savedData = JSON.parse(lastCall[1]);

      expect(savedData.version).toBe('1.0');
      expect(savedData.todos).toHaveLength(1);
      expect(savedData.todos[0].text).toBe('新Todo');
      expect(savedData.todos[0].completed).toBe(false);
      expect(savedData.metadata.totalCreated).toBe(1);
      expect(savedData.metadata.totalCompleted).toBe(0);
    });

    it('should update localStorage when completing todos', async () => {
      render(<MockPersistentApp />);

      // Add a todo
      await userEvent.type(screen.getByTestId('todo-input'), '待完成Todo');
      await userEvent.click(screen.getByTestId('add-btn'));

      // Complete it
      await userEvent.click(screen.getByTestId('complete-test-uuid-1'));

      // Verify completion is saved
      const lastCall = mockStorage.setItem.mock.calls.slice(-1)[0];
      const savedData = JSON.parse(lastCall[1]);

      expect(savedData.todos[0].completed).toBe(true);
      expect(savedData.todos[0].completedAt).toBeDefined();
      expect(savedData.metadata.totalCompleted).toBe(1);
    });

    it('should update localStorage when deleting todos', async () => {
      render(<MockPersistentApp />);

      // Add two todos
      await userEvent.type(screen.getByTestId('todo-input'), 'Todo 1');
      await userEvent.click(screen.getByTestId('add-btn'));

      await userEvent.type(screen.getByTestId('todo-input'), 'Todo 2');
      await userEvent.click(screen.getByTestId('add-btn'));

      // Delete one
      await userEvent.click(screen.getByTestId('delete-test-uuid-1'));

      // Verify deletion is saved
      const lastCall = mockStorage.setItem.mock.calls.slice(-1)[0];
      const savedData = JSON.parse(lastCall[1]);

      expect(savedData.todos).toHaveLength(1);
      expect(savedData.todos[0].text).toBe('Todo 2');
    });
  });

  describe('Data Format and Versioning', () => {
    it('should save data in correct format with version and metadata', async () => {
      render(<MockPersistentApp />);

      await userEvent.type(screen.getByTestId('todo-input'), '测试Todo');
      await userEvent.click(screen.getByTestId('add-btn'));

      const lastCall = mockStorage.setItem.mock.calls.slice(-1)[0];
      const savedData = JSON.parse(lastCall[1]);

      // Verify structure
      expect(savedData).toHaveProperty('version', '1.0');
      expect(savedData).toHaveProperty('todos');
      expect(savedData).toHaveProperty('metadata');

      // Verify metadata
      expect(savedData.metadata).toHaveProperty('lastModified');
      expect(savedData.metadata).toHaveProperty('totalCreated');
      expect(savedData.metadata).toHaveProperty('totalCompleted');

      // Verify date format
      expect(new Date(savedData.metadata.lastModified)).toBeInstanceOf(Date);
    });

    it('should preserve date objects in todos', async () => {
      render(<MockPersistentApp />);

      await userEvent.type(screen.getByTestId('todo-input'), '日期测试');
      await userEvent.click(screen.getByTestId('add-btn'));

      await userEvent.click(screen.getByTestId('complete-test-uuid-1'));

      const lastCall = mockStorage.setItem.mock.calls.slice(-1)[0];
      const savedData = JSON.parse(lastCall[1]);

      const todo = savedData.todos[0];
      expect(todo.createdAt).toBeDefined();
      expect(todo.completedAt).toBeDefined();

      // Verify dates can be parsed
      expect(new Date(todo.createdAt)).toBeInstanceOf(Date);
      expect(new Date(todo.completedAt)).toBeInstanceOf(Date);
    });
  });

  describe('Simulated App Restart', () => {
    it('should maintain state across simulated app restarts', async () => {
      // First render - add some todos
      const { unmount } = render(<MockPersistentApp />);

      await userEvent.type(screen.getByTestId('todo-input'), 'Todo 1');
      await userEvent.click(screen.getByTestId('add-btn'));

      await userEvent.type(screen.getByTestId('todo-input'), 'Todo 2');
      await userEvent.click(screen.getByTestId('add-btn'));

      await userEvent.click(screen.getByTestId('complete-test-uuid-1'));

      // Unmount (simulate closing app)
      unmount();

      // Re-render (simulate reopening app)
      render(<MockPersistentApp />);

      // Verify data persisted
      expect(screen.getByText('Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Todo 2')).toBeInTheDocument();
      expect(screen.getByTestId('status-test-uuid-1')).toHaveTextContent('Completed');
      expect(screen.getByTestId('status-test-uuid-2')).toHaveTextContent('Pending');
      expect(screen.getByTestId('storage-info')).toHaveTextContent('Stored: 2 todos');
    });
  });

  describe('Storage Size and Limits', () => {
    it('should handle large amounts of todo data', async () => {
      render(<MockPersistentApp />);

      // Add many todos
      for (let i = 1; i <= 100; i++) {
        await userEvent.type(screen.getByTestId('todo-input'), `Todo ${i}`);
        await userEvent.click(screen.getByTestId('add-btn'));
      }

      expect(screen.getByTestId('storage-info')).toHaveTextContent('Stored: 100 todos');

      // Verify storage was called for each addition
      expect(mockStorage.setItem).toHaveBeenCalledTimes(100);

      // Verify final data size
      const lastCall = mockStorage.setItem.mock.calls.slice(-1)[0];
      const savedData = JSON.parse(lastCall[1]);
      expect(savedData.todos).toHaveLength(100);
    });

    it('should handle very long todo text', async () => {
      render(<MockPersistentApp />);

      const longText = 'a'.repeat(10000);
      await userEvent.type(screen.getByTestId('todo-input'), longText);
      await userEvent.click(screen.getByTestId('add-btn'));

      const lastCall = mockStorage.setItem.mock.calls.slice(-1)[0];
      const savedData = JSON.parse(lastCall[1]);
      expect(savedData.todos[0].text).toBe(longText);
    });
  });
});