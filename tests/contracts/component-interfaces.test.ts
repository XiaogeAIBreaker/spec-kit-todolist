/**
 * 组件接口合约测试
 * 验证React组件props接口的类型安全和回调函数契约
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

// Mock components for testing interfaces
const MockTodoList: React.FC<{
  todos: TodoItem[];
  onAddTodo: (text: string) => void;
  onCompleteTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  isLoading?: boolean;
}> = ({ todos, onAddTodo, onCompleteTodo, onDeleteTodo, isLoading }) => (
  <div data-testid="todo-list">
    {isLoading && <div data-testid="loading">Loading...</div>}
    {todos.map(todo => (
      <div key={todo.id} data-testid={`todo-${todo.id}`}>
        <span>{todo.text}</span>
        {!todo.completed && (
          <button onClick={() => onCompleteTodo(todo.id)} data-testid={`complete-${todo.id}`}>
            Complete
          </button>
        )}
        <button onClick={() => onDeleteTodo(todo.id)} data-testid={`delete-${todo.id}`}>
          Delete
        </button>
      </div>
    ))}
    <button onClick={() => onAddTodo('New todo')} data-testid="add-todo">
      Add Todo
    </button>
  </div>
);

const MockTodoItem: React.FC<{
  todo: TodoItem;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isAnimating?: boolean;
}> = ({ todo, onComplete, onDelete, isAnimating }) => (
  <div data-testid={`todo-item-${todo.id}`} className={isAnimating ? 'animating' : ''}>
    <span data-testid="todo-text">{todo.text}</span>
    <span data-testid="todo-status">{todo.completed ? 'Completed' : 'Pending'}</span>
    {!todo.completed && (
      <button onClick={() => onComplete(todo.id)} data-testid="complete-btn">
        Complete
      </button>
    )}
    <button onClick={() => onDelete(todo.id)} data-testid="delete-btn">
      Delete
    </button>
  </div>
);

const MockAddTodoForm: React.FC<{
  onSubmit: (text: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
}> = ({ onSubmit, isDisabled, placeholder }) => {
  const [text, setText] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="add-todo-form">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || 'Add a new todo...'}
        disabled={isDisabled}
        data-testid="todo-input"
      />
      <button type="submit" disabled={isDisabled || !text.trim()} data-testid="submit-btn">
        Add
      </button>
    </form>
  );
};

const MockCompletionCelebration: React.FC<{
  show: boolean;
  todoText: string;
  onAnimationEnd: () => void;
  duration?: number;
}> = ({ show, todoText, onAnimationEnd, duration = 20000 }) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(onAnimationEnd, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onAnimationEnd, duration]);

  return show ? (
    <div data-testid="celebration" data-duration={duration}>
      <h2>🎉 Congratulations!</h2>
      <p>You completed: {todoText}</p>
    </div>
  ) : null;
};

const MockEmptyState: React.FC<{
  onAddFirst: () => void;
  message?: string;
}> = ({ onAddFirst, message }) => (
  <div data-testid="empty-state">
    <p>{message || 'No todos yet. Add your first one!'}</p>
    <button onClick={onAddFirst} data-testid="add-first-btn">
      Add First Todo
    </button>
  </div>
);

// Add React import for useState and useEffect
import React from 'react';

describe('Component Interface Contract Tests', () => {
  const mockTodo: TodoItem = {
    id: 'test-1',
    text: 'Test todo',
    completed: false,
    createdAt: new Date('2025-01-01')
  };

  const completedTodo: TodoItem = {
    id: 'test-2',
    text: 'Completed todo',
    completed: true,
    createdAt: new Date('2025-01-01'),
    completedAt: new Date('2025-01-02')
  };

  describe('TodoListProps Interface', () => {
    it('should render todos and handle all callback props', async () => {
      const mockCallbacks = {
        onAddTodo: jest.fn(),
        onCompleteTodo: jest.fn(),
        onDeleteTodo: jest.fn()
      };

      render(
        <MockTodoList
          todos={[mockTodo]}
          {...mockCallbacks}
          isLoading={false}
        />
      );

      // Verify todos are rendered
      expect(screen.getByTestId('todo-test-1')).toBeInTheDocument();
      expect(screen.getByText('Test todo')).toBeInTheDocument();

      // Test callback invocations
      await userEvent.click(screen.getByTestId('complete-test-1'));
      expect(mockCallbacks.onCompleteTodo).toHaveBeenCalledWith('test-1');

      await userEvent.click(screen.getByTestId('delete-test-1'));
      expect(mockCallbacks.onDeleteTodo).toHaveBeenCalledWith('test-1');

      await userEvent.click(screen.getByTestId('add-todo'));
      expect(mockCallbacks.onAddTodo).toHaveBeenCalledWith('New todo');
    });

    it('should show loading state when isLoading is true', () => {
      render(
        <MockTodoList
          todos={[]}
          onAddTodo={jest.fn()}
          onCompleteTodo={jest.fn()}
          onDeleteTodo={jest.fn()}
          isLoading={true}
        />
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('TodoItemProps Interface', () => {
    it('should render todo item and handle completion/deletion', async () => {
      const mockCallbacks = {
        onComplete: jest.fn(),
        onDelete: jest.fn()
      };

      render(
        <MockTodoItem
          todo={mockTodo}
          {...mockCallbacks}
          isAnimating={false}
        />
      );

      expect(screen.getByTestId('todo-text')).toHaveTextContent('Test todo');
      expect(screen.getByTestId('todo-status')).toHaveTextContent('Pending');

      await userEvent.click(screen.getByTestId('complete-btn'));
      expect(mockCallbacks.onComplete).toHaveBeenCalledWith('test-1');

      await userEvent.click(screen.getByTestId('delete-btn'));
      expect(mockCallbacks.onDelete).toHaveBeenCalledWith('test-1');
    });

    it('should not show complete button for completed todos', () => {
      render(
        <MockTodoItem
          todo={completedTodo}
          onComplete={jest.fn()}
          onDelete={jest.fn()}
        />
      );

      expect(screen.getByTestId('todo-status')).toHaveTextContent('Completed');
      expect(screen.queryByTestId('complete-btn')).not.toBeInTheDocument();
    });

    it('should apply animation class when isAnimating is true', () => {
      render(
        <MockTodoItem
          todo={mockTodo}
          onComplete={jest.fn()}
          onDelete={jest.fn()}
          isAnimating={true}
        />
      );

      expect(screen.getByTestId('todo-item-test-1')).toHaveClass('animating');
    });
  });

  describe('AddTodoFormProps Interface', () => {
    it('should submit valid text and clear input', async () => {
      const mockOnSubmit = jest.fn();

      render(
        <MockAddTodoForm
          onSubmit={mockOnSubmit}
          placeholder="Enter todo..."
        />
      );

      const input = screen.getByTestId('todo-input');
      const submitBtn = screen.getByTestId('submit-btn');

      expect(input).toHaveAttribute('placeholder', 'Enter todo...');

      await userEvent.type(input, 'New todo item');
      await userEvent.click(submitBtn);

      expect(mockOnSubmit).toHaveBeenCalledWith('New todo item');
      expect(input).toHaveValue('');
    });

    it('should not submit empty or whitespace-only text', async () => {
      const mockOnSubmit = jest.fn();

      render(<MockAddTodoForm onSubmit={mockOnSubmit} />);

      const input = screen.getByTestId('todo-input');
      const submitBtn = screen.getByTestId('submit-btn');

      await userEvent.type(input, '   ');
      expect(submitBtn).toBeDisabled();

      fireEvent.submit(screen.getByTestId('add-todo-form'));
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should be disabled when isDisabled prop is true', () => {
      render(
        <MockAddTodoForm
          onSubmit={jest.fn()}
          isDisabled={true}
        />
      );

      expect(screen.getByTestId('todo-input')).toBeDisabled();
      expect(screen.getByTestId('submit-btn')).toBeDisabled();
    });
  });

  describe('CompletionCelebrationProps Interface', () => {
    it('should show celebration and call onAnimationEnd after duration', async () => {
      const mockOnAnimationEnd = jest.fn();

      render(
        <MockCompletionCelebration
          show={true}
          todoText="Test completed todo"
          onAnimationEnd={mockOnAnimationEnd}
          duration={100} // Short duration for testing
        />
      );

      expect(screen.getByTestId('celebration')).toBeInTheDocument();
      expect(screen.getByText('You completed: Test completed todo')).toBeInTheDocument();

      // Wait for animation to end
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(mockOnAnimationEnd).toHaveBeenCalled();
    });

    it('should not render when show is false', () => {
      render(
        <MockCompletionCelebration
          show={false}
          todoText="Test todo"
          onAnimationEnd={jest.fn()}
        />
      );

      expect(screen.queryByTestId('celebration')).not.toBeInTheDocument();
    });

    it('should use default duration of 20 seconds when not specified', () => {
      render(
        <MockCompletionCelebration
          show={true}
          todoText="Test todo"
          onAnimationEnd={jest.fn()}
        />
      );

      expect(screen.getByTestId('celebration')).toHaveAttribute('data-duration', '20000');
    });
  });

  describe('EmptyStateProps Interface', () => {
    it('should render custom message and handle add first action', async () => {
      const mockOnAddFirst = jest.fn();

      render(
        <MockEmptyState
          onAddFirst={mockOnAddFirst}
          message="Custom empty message"
        />
      );

      expect(screen.getByText('Custom empty message')).toBeInTheDocument();

      await userEvent.click(screen.getByTestId('add-first-btn'));
      expect(mockOnAddFirst).toHaveBeenCalled();
    });

    it('should use default message when not provided', () => {
      render(<MockEmptyState onAddFirst={jest.fn()} />);

      expect(screen.getByText('No todos yet. Add your first one!')).toBeInTheDocument();
    });
  });
});