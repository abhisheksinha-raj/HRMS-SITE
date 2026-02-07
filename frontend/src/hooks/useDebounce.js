import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing values
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay) => {
  const timeoutRef = useRef(null);

  const debouncedValue = useCallback((newValue) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      return newValue;
    }, delay);

    return newValue;
  }, [delay]);

  return debouncedValue(value);
};

/**
 * Custom hook for debouncing callbacks
 * @param {Function} callback - The callback to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced callback
 */
export const useDebouncedCallback = (callback, delay) => {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};
