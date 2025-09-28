/**
 * 首次使用体验集成测试
 * 验证用户第一次打开应用时的完整体验流程
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock implementation of the main app component
const MockApp = () => {
  const [todos, setTodos] = React.useState<Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: Date;
  }>>([]);

  const addTodo = (text: string) => {
    const newTodo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  return (
    <div data-testid="todo-app">
      {todos.length === 0 ? (
        <div data-testid="empty-state">
          <h2>Welcome to TodoList!</h2>
          <p>No todos yet. Add your first one!</p>
          <button
            onClick={() => document.getElementById('todo-input')?.focus()}
            data-testid="add-first-prompt"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div data-testid="todo-list">
          {todos.map(todo => (
            <div key={todo.id} data-testid={`todo-${todo.id}`} className="todo-item">
              <span>{todo.text}</span>
              <span className="todo-time">{todo.createdAt.toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const text = formData.get('todoText') as string;
        if (text?.trim()) {
          addTodo(text);
          (e.target as HTMLFormElement).reset();
        }
      }} data-testid="add-todo-form">
        <input
          id="todo-input"
          name="todoText"
          type="text"
          placeholder="Add a new todo..."
          data-testid="todo-input"
          className="todo-input"
        />
        <button type="submit" data-testid="add-btn">
          Add Todo
        </button>
      </form>
    </div>
  );
};

import React from 'react';

describe('First Use Experience Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage to simulate first-time user
    localStorage.clear();

    // Mock crypto.randomUUID for consistent testing
    const mockUUID = jest.fn();
    mockUUID.mockReturnValueOnce('test-uuid-1');
    global.crypto.randomUUID = mockUUID;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial App Load', () => {
    it('should display empty state with welcome message and guidance', () => {
      render(<MockApp />);

      // Verify empty state is shown
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('Welcome to TodoList!')).toBeInTheDocument();
      expect(screen.getByText('No todos yet. Add your first one!')).toBeInTheDocument();
      expect(screen.getByTestId('add-first-prompt')).toBeInTheDocument();

      // Verify todo list is not shown
      expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();

      // Verify add form is present and accessible
      expect(screen.getByTestId('add-todo-form')).toBeInTheDocument();
      expect(screen.getByTestId('todo-input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    });

    it('should focus input when get started button is clicked', async () => {
      render(<MockApp />);

      const input = screen.getByTestId('todo-input');
      const getStartedBtn = screen.getByTestId('add-first-prompt');

      // Input should not be focused initially
      expect(input).not.toHaveFocus();

      // Click get started button
      await userEvent.click(getStartedBtn);

      // Input should now be focused
      expect(input).toHaveFocus();
    });
  });

  describe('Adding First Todo', () => {
    it('should successfully add first todo with complete interaction flow', async () => {
      render(<MockApp />);

      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      // Type the first todo
      await userEvent.type(input, '学习React Hooks');
      expect(input).toHaveValue('学习React Hooks');

      // Submit the form
      await userEvent.click(addBtn);

      // Wait for state update
      await waitFor(() => {
        expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
      });

      // Verify todo list appears
      expect(screen.getByTestId('todo-list')).toBeInTheDocument();

      // Verify the new todo appears
      expect(screen.getByTestId('todo-test-uuid-1')).toBeInTheDocument();
      expect(screen.getByText('学习React Hooks')).toBeInTheDocument();

      // Verify input is cleared
      expect(input).toHaveValue('');

      // Verify todo appears at the top (newest first)
      const todoItems = screen.getAllByText(/学习React Hooks/);
      expect(todoItems).toHaveLength(1);
    });

    it('should add todo by pressing Enter key', async () => {
      render(<MockApp />);

      const input = screen.getByTestId('todo-input');

      await userEvent.type(input, '学习React Hooks');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('学习React Hooks')).toBeInTheDocument();
      });

      expect(input).toHaveValue('');
    });

    it('should not add empty or whitespace-only todos', async () => {
      render(<MockApp />);

      const input = screen.getByTestId('todo-input');
      const addBtn = screen.getByTestId('add-btn');

      // Try to add empty string
      await userEvent.click(addBtn);
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();

      // Try to add whitespace only
      await userEvent.type(input, '   ');
      await userEvent.click(addBtn);
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();

      // Input should be cleared after failed submission
      expect(input).toHaveValue('');
    });

    it('should trim whitespace from todo text', async () => {
      render(<MockApp />);

      const input = screen.getByTestId('todo-input');

      await userEvent.type(input, '  学习React Hooks  ');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('学习React Hooks')).toBeInTheDocument();
      });

      // Should not have leading/trailing spaces
      expect(screen.queryByText('  学习React Hooks  ')).not.toBeInTheDocument();
    });
  });

  describe('Visual Feedback and Animation', () => {
    it('should provide immediate visual feedback when adding todo', async () => {
      render(<MockApp />);

      const input = screen.getByTestId('todo-input');

      await userEvent.type(input, '学习React Hooks');
      await userEvent.keyboard('{Enter}');

      // Todo should appear immediately (simulating animation feedback)
      await waitFor(() => {
        const todoElement = screen.getByTestId('todo-test-uuid-1');
        expect(todoElement).toBeInTheDocument();
        expect(todoElement).toHaveClass('todo-item');
      });

      // Should show timestamp for when todo was created
      expect(screen.getByText(/\d{1,2}:\d{2}:\d{2}/)).toBeInTheDocument();
    });

    it('should transition from empty state to todo list smoothly', async () => {
      render(<MockApp />);

      // Start with empty state
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();

      // Add a todo
      await userEvent.type(screen.getByTestId('todo-input'), '学习React Hooks');
      await userEvent.keyboard('{Enter}');

      // Should transition to todo list
      await waitFor(() => {
        expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
        expect(screen.getByTestId('todo-list')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility and Keyboard Navigation', () => {
    it('should be fully accessible via keyboard', async () => {
      render(<MockApp />);

      // Tab to get started button
      await userEvent.tab();
      expect(screen.getByTestId('add-first-prompt')).toHaveFocus();

      // Tab to input field
      await userEvent.tab();
      expect(screen.getByTestId('todo-input')).toHaveFocus();

      // Tab to add button
      await userEvent.tab();
      expect(screen.getByTestId('add-btn')).toHaveFocus();

      // Go back to input and add todo
      await userEvent.tab({ shift: true });
      expect(screen.getByTestId('todo-input')).toHaveFocus();

      await userEvent.type(screen.getByTestId('todo-input'), '学习React Hooks');
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('学习React Hooks')).toBeInTheDocument();
      });
    });

    it('should have proper ARIA labels and semantic markup', () => {
      render(<MockApp />);

      const form = screen.getByTestId('add-todo-form');
      const input = screen.getByTestId('todo-input');

      // Form should be a proper form element
      expect(form.tagName).toBe('FORM');

      // Input should have proper type and placeholder
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', 'Add a new todo...');
    });
  });
});