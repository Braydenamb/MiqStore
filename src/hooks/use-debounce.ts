import { useState, useEffect } from "react";

/**
 * Debounces a value, delaying updates until after the specified delay.
 * Prevents excessive API calls on rapid user input (e.g. search boxes).
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
