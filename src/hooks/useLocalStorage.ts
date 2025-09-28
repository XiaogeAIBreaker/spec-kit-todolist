/**
 * useLocalStorage Hook
 * 提供localStorage的抽象封装
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseLocalStorageOptions<T> {
  serializer?: {
    parse: (value: string) => T;
    stringify: (value: T) => string;
  };
  onError?: (error: Error) => void;
  syncAcrossTabs?: boolean;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  error: Error | null;
  isLoading: boolean;
}

/**
 * useLocalStorage Hook
 * @param key localStorage键名
 * @param defaultValue 默认值
 * @param options 配置选项
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
  const {
    serializer = {
      parse: JSON.parse,
      stringify: JSON.stringify
    },
    onError = console.error,
    syncAcrossTabs = true
  } = options;

  const [value, setValue] = useState<T>(defaultValue);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitializedRef = useRef(false);

  // 读取localStorage值
  const readValue = useCallback((): T => {
    try {
      if (typeof window === 'undefined') {
        return defaultValue;
      }

      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      return serializer.parse(item);
    } catch (err) {
      const error = new Error(`Error reading localStorage key "${key}": ${err}`);
      onError(error);
      setError(error);
      return defaultValue;
    }
  }, [key, defaultValue, serializer, onError]);

  // 设置localStorage值
  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        setError(null);

        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;

        setValue(valueToStore);

        if (typeof window !== 'undefined') {
          localStorage.setItem(key, serializer.stringify(valueToStore));
        }

        // 派发自定义事件以实现跨标签页同步
        if (syncAcrossTabs && typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('localStorage-change', {
              detail: { key, value: valueToStore }
            })
          );
        }
      } catch (err) {
        const error = new Error(`Error setting localStorage key "${key}": ${err}`);
        onError(error);
        setError(error);
      }
    },
    [key, value, serializer, onError, syncAcrossTabs]
  );

  // 删除localStorage值
  const removeStoredValue = useCallback(() => {
    try {
      setError(null);
      setValue(defaultValue);

      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }

      // 派发自定义事件
      if (syncAcrossTabs && typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('localStorage-change', {
            detail: { key, value: null }
          })
        );
      }
    } catch (err) {
      const error = new Error(`Error removing localStorage key "${key}": ${err}`);
      onError(error);
      setError(error);
    }
  }, [key, defaultValue, onError, syncAcrossTabs]);

  // 初始化时读取值
  useEffect(() => {
    if (!isInitializedRef.current) {
      const initialValue = readValue();
      setValue(initialValue);
      setIsLoading(false);
      isInitializedRef.current = true;
    }
  }, [readValue]);

  // 监听localStorage变化事件
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue === null
            ? defaultValue
            : serializer.parse(e.newValue);
          setValue(newValue);
          setError(null);
        } catch (err) {
          const error = new Error(`Error parsing localStorage change for key "${key}": ${err}`);
          onError(error);
          setError(error);
        }
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setValue(e.detail.value ?? defaultValue);
        setError(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorage-change', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage-change', handleCustomStorageChange as EventListener);
    };
  }, [key, defaultValue, serializer, onError, syncAcrossTabs]);

  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
    error,
    isLoading
  };
}

// 特化的hook用于不同数据类型
export function useLocalStorageString(
  key: string,
  defaultValue: string = '',
  options: Omit<UseLocalStorageOptions<string>, 'serializer'> = {}
) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serializer: {
      parse: (value: string) => value,
      stringify: (value: string) => value
    }
  });
}

export function useLocalStorageNumber(
  key: string,
  defaultValue: number = 0,
  options: Omit<UseLocalStorageOptions<number>, 'serializer'> = {}
) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serializer: {
      parse: (value: string) => {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
          throw new Error(`Cannot parse "${value}" as number`);
        }
        return parsed;
      },
      stringify: (value: number) => value.toString()
    }
  });
}

export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean = false,
  options: Omit<UseLocalStorageOptions<boolean>, 'serializer'> = {}
) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serializer: {
      parse: (value: string) => value === 'true',
      stringify: (value: boolean) => value.toString()
    }
  });
}

// 工具函数：检查localStorage是否可用
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    const testKey = '__localStorage_test__';
    const testValue = 'test';

    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    return retrieved === testValue;
  } catch {
    return false;
  }
}

// 工具函数：获取localStorage使用情况
export function getLocalStorageUsage(): { used: number; total: number; percentage: number } {
  if (typeof window === 'undefined' || !isLocalStorageAvailable()) {
    return { used: 0, total: 0, percentage: 0 };
  }

  let totalSize = 0;

  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += key.length + value.length;
      }
    }
  }

  // localStorage limit is typically around 5-10MB, we'll assume 5MB
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  const percentage = (totalSize / maxSize) * 100;

  return {
    used: totalSize,
    total: maxSize,
    percentage: Math.min(percentage, 100)
  };
}