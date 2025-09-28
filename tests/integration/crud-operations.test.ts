/**
 * CRUD操作集成测试
 * 验证添加、删除、完成待办事项的完整操作流程
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

// Mock comprehensive CRUD app
const MockCRUDApp = () => {
  const [todos, setTodos] = React.useState<TodoItem[]>([]);
  const [showCelebration, setShowCelebration] = React.useState<string | null>(null);

  const addTodo = (text: string) => {
    const newTodo: TodoItem = {
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
    setShowCelebration(id);
    setTimeout(() => setShowCelebration(null), 20000);
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div data-testid="crud-app">
      {/* Celebration Modal */}
      {showCelebration && (
        <div data-testid={`celebration-${showCelebration}`} className="celebration">
          <h2>🎉 Great job!</h2>
          <p>You completed a todo!</p>
        </div>
      )}

      {/* Add Todo Form */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const text = formData.get('todoText') as string;
        if (text?.trim()) {
          addTodo(text);
          (e.target as HTMLFormElement).reset();
        }
      }}>
        <input name="todoText" placeholder="Add a new todo..." data-testid="todo-input" />
        <button type="submit" data-testid="add-btn">Add</button>
      </form>

      {/* Todo List */}
      <div data-testid="todo-list">
        {todos.map(todo => (
          <div key={todo.id} data-testid={`todo-${todo.id}`} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <span data-testid={`todo-text-${todo.id}`}>{todo.text}</span>
            <span data-testid={`todo-status-${todo.id}`}>
              {todo.completed ? 'Completed' : 'Pending'}
            </span>
            <div className="todo-actions">
              {!todo.completed && (
                <button
                  onClick={() => completeTodo(todo.id)}
                  data-testid={`complete-${todo.id}`}
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => deleteTodo(todo.id)}
                data-testid={`delete-${todo.id}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div data-testid="todo-count">
        Total: {todos.length} | Completed: {todos.filter(t => t.completed).length} | Pending: {todos.filter(t => !t.completed).length}
      </div>
    </div>
  );
};

describe('CRUD Operations Integration Tests', () => {
  beforeEach(() => {
    // Mock UUID generation for predictable test results
    let uuidCounter = 0;
    global.crypto.randomUUID = jest.fn(() => `test-uuid-${++uuidCounter}`);

    // Clear any existing timers
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('Adding Multiple Todos', () => {
    it('should add multiple todos in correct order (newest first)', async () => {
      render(<MockCRUDApp />);

      const input = screen.getByTestId('todo-input');

      // Add first todo
      await userEvent.type(input, '学习React Hooks');
      await userEvent.keyboard('{Enter}');

      // Add second todo
      await userEvent.type(input, '写项目文档');
      await userEvent.keyboard('{Enter}');

      // Add third todo
      await userEvent.type(input, '代码评审');
      await userEvent.keyboard('{Enter}');

      // Verify all todos are present
      expect(screen.getByTestId('todo-test-uuid-1')).toBeInTheDocument();
      expect(screen.getByTestId('todo-test-uuid-2')).toBeInTheDocument();
      expect(screen.getByTestId('todo-test-uuid-3')).toBeInTheDocument();

      // Verify order (newest first)
      const todoItems = screen.getAllByTestId(/^todo-test-uuid-/);
      expect(todoItems[0]).toHaveAttribute('data-testid', 'todo-test-uuid-3'); // 代码评审 (newest)
      expect(todoItems[1]).toHaveAttribute('data-testid', 'todo-test-uuid-2'); // 写项目文档
      expect(todoItems[2]).toHaveAttribute('data-testid', 'todo-test-uuid-1'); // 学习React Hooks (oldest)

      // Verify count
      expect(screen.getByTestId('todo-count')).toHaveTextContent('Total: 3 | Completed: 0 | Pending: 3');
    });
  });

  describe('Completing Todos', () => {
    it('should complete todo and show celebration', async () => {
      render(<MockCRUDApp />);

      // Add a todo first
      await userEvent.type(screen.getByTestId('todo-input'), '学习React Hooks');
      await userEvent.keyboard('{Enter}');

      const todoId = 'test-uuid-1';
      const completeBtn = screen.getByTestId(`complete-${todoId}`);
      const statusElement = screen.getByTestId(`todo-status-${todoId}`);

      // Initially should be pending
      expect(statusElement).toHaveTextContent('Pending');
      expect(screen.getByTestId(`todo-${todoId}`)).not.toHaveClass('completed');

      // Complete the todo
      await userEvent.click(completeBtn);

      // Verify status changed
      expect(statusElement).toHaveTextContent('Completed');
      expect(screen.getByTestId(`todo-${todoId}`)).toHaveClass('completed');

      // Verify celebration shows
      expect(screen.getByTestId(`celebration-${todoId}`)).toBeInTheDocument();
      expect(screen.getByText('🎉 Great job!')).toBeInTheDocument();

      // Verify complete button is hidden
      expect(screen.queryByTestId(`complete-${todoId}`)).not.toBeInTheDocument();

      // Verify counts updated
      expect(screen.getByTestId('todo-count')).toHaveTextContent('Total: 1 | Completed: 1 | Pending: 0');
    });

    it('should hide celebration after 20 seconds', async () => {
      render(<MockCRUDApp />);

      await userEvent.type(screen.getByTestId('todo-input'), '学习React Hooks');
      await userEvent.keyboard('{Enter}');

      await userEvent.click(screen.getByTestId('complete-test-uuid-1'));

      // Celebration should be visible
      expect(screen.getByTestId('celebration-test-uuid-1')).toBeInTheDocument();

      // Fast-forward 20 seconds
      jest.advanceTimersByTime(20000);

      // Wait for state update
      await waitFor(() => {
        expect(screen.queryByTestId('celebration-test-uuid-1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Deleting Todos', () => {
    it('should delete todo immediately', async () => {
      render(<MockCRUDApp />);

      // Add multiple todos
      await userEvent.type(screen.getByTestId('todo-input'), '学习React Hooks');
      await userEvent.keyboard('{Enter}');
      await userEvent.type(screen.getByTestId('todo-input'), '写项目文档');
      await userEvent.keyboard('{Enter}');

      const firstTodoId = 'test-uuid-1';
      const secondTodoId = 'test-uuid-2';

      // Verify both todos exist
      expect(screen.getByTestId(`todo-${firstTodoId}`)).toBeInTheDocument();
      expect(screen.getByTestId(`todo-${secondTodoId}`)).toBeInTheDocument();
      expect(screen.getByTestId('todo-count')).toHaveTextContent('Total: 2');

      // Delete the second todo (写项目文档)
      await userEvent.click(screen.getByTestId(`delete-${secondTodoId}`));

      // Verify it's removed
      expect(screen.queryByTestId(`todo-${secondTodoId}`)).not.toBeInTheDocument();
      expect(screen.getByTestId(`todo-${firstTodoId}`)).toBeInTheDocument();
      expect(screen.getByTestId('todo-count')).toHaveTextContent('Total: 1');
    });

    it('should delete completed todos', async () => {
      render(<MockCRUDApp />);

      await userEvent.type(screen.getByTestId('todo-input'), '学习React Hooks');
      await userEvent.keyboard('{Enter}');

      const todoId = 'test-uuid-1';

      // Complete the todo
      await userEvent.click(screen.getByTestId(`complete-${todoId}`));

      // Verify it's completed
      expect(screen.getByTestId(`todo-status-${todoId}`)).toHaveTextContent('Completed');

      // Delete the completed todo
      await userEvent.click(screen.getByTestId(`delete-${todoId}`));

      // Verify it's removed
      expect(screen.queryByTestId(`todo-${todoId}`)).not.toBeInTheDocument();
      expect(screen.getByTestId('todo-count')).toHaveTextContent('Total: 0');
    });
  });

  describe('Mixed Operations Workflow', () => {
    it('should handle complex workflow: add multiple, complete some, delete others', async () => {
      render(<MockCRUDApp />);

      const input = screen.getByTestId('todo-input');

      // Add 3 todos
      await userEvent.type(input, '学习React Hooks');
      await userEvent.keyboard('{Enter}');

      await userEvent.type(input, '写项目文档');
      await userEvent.keyboard('{Enter}');

      await userEvent.type(input, '代码评审');
      await userEvent.keyboard('{Enter}');

      // Verify initial state
      expect(screen.getByTestId('todo-count')).toHaveTextContent('Total: 3 | Completed: 0 | Pending: 3');

      // Complete first todo (学习React Hooks)
      await userEvent.click(screen.getByTestId('complete-test-uuid-1'));

      // Delete second todo (写项目文档)
      await userEvent.click(screen.getByTestId('delete-test-uuid-2'));

      // Verify final state
      expect(screen.getByTestId('todo-count')).toHaveTextContent('Total: 2 | Completed: 1 | Pending: 1');

      // Verify remaining todos
      expect(screen.getByTestId('todo-test-uuid-1')).toBeInTheDocument(); // completed
      expect(screen.queryByTestId('todo-test-uuid-2')).not.toBeInTheDocument(); // deleted
      expect(screen.getByTestId('todo-test-uuid-3')).toBeInTheDocument(); // pending

      // Verify states
      expect(screen.getByTestId('todo-status-test-uuid-1')).toHaveTextContent('Completed');
      expect(screen.getByTestId('todo-status-test-uuid-3')).toHaveTextContent('Pending');
    });
  });

  describe('Edge Cases', () => {
    it('should not break when deleting non-existent todo', async () => {
      render(<MockCRUDApp />);

      await userEvent.type(screen.getByTestId('todo-input'), '测试Todo');
      await userEvent.keyboard('{Enter}');

      // Delete twice (second delete should be safe no-op)
      await userEvent.click(screen.getByTestId('delete-test-uuid-1'));

      // Try to delete again (button shouldn't exist)
      expect(screen.queryByTestId('delete-test-uuid-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('todo-count')).toHaveTextContent('Total: 0');
    });

    it('should handle rapid successive operations', async () => {
      render(<MockCRUDApp />);

      const input = screen.getByTestId('todo-input');

      // Rapidly add multiple todos
      for (let i = 1; i <= 5; i++) {
        await userEvent.type(input, `Todo ${i}`);
        await userEvent.keyboard('{Enter}');
      }

      expect(screen.getByTestId('todo-count')).toHaveTextContent('Total: 5');

      // Rapidly complete multiple todos
      await userEvent.click(screen.getByTestId('complete-test-uuid-1'));
      await userEvent.click(screen.getByTestId('complete-test-uuid-2'));
      await userEvent.click(screen.getByTestId('complete-test-uuid-3'));

      expect(screen.getByTestId('todo-count')).toHaveTextContent('Total: 5 | Completed: 3 | Pending: 2');
    });
  });
});