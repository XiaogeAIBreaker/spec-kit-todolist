/**
 * useTodos Hook
 * 使用Context API和useReducer管理TodoList状态
 */

import { useReducer, useEffect, useCallback, useRef } from 'react';
import { TodoItem, TodoState, TodoAction, sortTodosByCreatedDate } from '@/types/todo';
import { UseTodosReturn } from '@/types/components';
import { storageService, storageEventManager } from '@/utils/storage';
import { StorageError, ValidationError, NotFoundError } from '@/types/storage';

// 初始状态
const initialState: TodoState = {
  todos: [],
  isLoading: false,
  celebrationQueue: []
};

// Reducer函数
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'LOAD_TODOS':
      return {
        ...state,
        todos: sortTodosByCreatedDate(action.payload),
        isLoading: false
      };

    case 'ADD_TODO': {
      // 这里只是处理本地状态，实际的todo创建在异步函数中处理
      return state;
    }

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
        celebrationQueue: state.celebrationQueue.filter(id => id !== action.payload.id)
      };

    case 'COMPLETE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: true, completedAt: new Date() }
            : todo
        )
      };

    case 'SHOW_CELEBRATION':
      return {
        ...state,
        celebrationQueue: [...state.celebrationQueue, action.payload.id]
      };

    case 'HIDE_CELEBRATION':
      return {
        ...state,
        celebrationQueue: state.celebrationQueue.filter(id => id !== action.payload.id)
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    default:
      return state;
  }
};

/**
 * useTodos Hook主函数
 */
export const useTodos = (): UseTodosReturn => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const errorRef = useRef<Error | null>(null);
  const celebrationTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 错误处理
  const handleError = useCallback((error: Error) => {
    console.error('Todo operation error:', error);
    errorRef.current = error;
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  // 加载待办事项
  const loadTodos = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const todos = await storageService.loadTodos();
      dispatch({ type: 'LOAD_TODOS', payload: todos });
      errorRef.current = null;
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError]);

  // 添加待办事项
  const addTodo = useCallback(async (text: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newTodo = await storageService.addTodo(text);

      // 重新加载所有todos以确保顺序正确
      const updatedTodos = await storageService.loadTodos();
      dispatch({ type: 'LOAD_TODOS', payload: updatedTodos });

      // 通知其他监听器
      storageEventManager.notifyListeners(updatedTodos);

      errorRef.current = null;
    } catch (error) {
      handleError(error as Error);
      throw error; // 重新抛出错误以便UI处理
    }
  }, [handleError]);

  // 完成待办事项
  const completeTodo = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const completedTodo = await storageService.completeTodo(id);

      // 更新本地状态
      dispatch({ type: 'COMPLETE_TODO', payload: { id } });

      // 显示庆祝动画
      dispatch({ type: 'SHOW_CELEBRATION', payload: { id } });

      // 设置20秒后自动隐藏庆祝动画
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_CELEBRATION', payload: { id } });
        celebrationTimersRef.current.delete(id);
      }, 20000);

      celebrationTimersRef.current.set(id, timer);

      // 重新加载以确保数据一致性
      const updatedTodos = await storageService.loadTodos();
      storageEventManager.notifyListeners(updatedTodos);

      errorRef.current = null;
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [handleError]);

  // 删除待办事项
  const deleteTodo = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await storageService.deleteTodo(id);

      // 更新本地状态
      dispatch({ type: 'DELETE_TODO', payload: { id } });

      // 清除相关的庆祝动画定时器
      const timer = celebrationTimersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        celebrationTimersRef.current.delete(id);
      }

      // 重新加载以确保数据一致性
      const updatedTodos = await storageService.loadTodos();
      storageEventManager.notifyListeners(updatedTodos);

      errorRef.current = null;
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [handleError]);

  // 手动清除庆祝动画
  const clearCelebration = useCallback((id: string) => {
    dispatch({ type: 'HIDE_CELEBRATION', payload: { id } });

    const timer = celebrationTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      celebrationTimersRef.current.delete(id);
    }
  }, []);

  // 初始化时加载数据
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // 监听存储变化（用于多标签页同步）
  useEffect(() => {
    const handleStorageChange = (todos: TodoItem[]) => {
      dispatch({ type: 'LOAD_TODOS', payload: todos });
    };

    storageEventManager.addListener(handleStorageChange);

    return () => {
      storageEventManager.removeListener(handleStorageChange);
    };
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      celebrationTimersRef.current.forEach(timer => {
        clearTimeout(timer);
      });
      celebrationTimersRef.current.clear();
    };
  }, []);

  return {
    todos: state.todos,
    isLoading: state.isLoading,
    celebrationQueue: state.celebrationQueue,
    addTodo,
    completeTodo,
    deleteTodo,
    clearCelebration,
    error: errorRef.current
  };
};

// 导出类型以便其他地方使用
export type TodosHook = ReturnType<typeof useTodos>;