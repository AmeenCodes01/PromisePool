import { useEffect, useMemo, useState } from "react";

/**
 * Custom hook that syncs a piece of state with localStorage.
 *
 * @param initialValue - Initial value if localStorage doesn't have a saved one.
 * @param id - A unique key to store and retrieve state in localStorage.
 * @returns [state, setState] tuple like useState
 */
export default function usePersistState<T>(initialValue: T, id: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const _initialValue = useMemo(() => {
    try {
      const stored = localStorage.getItem("state:" + id);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to parse localStorage for:", id, e);
    }
    return initialValue;
  }, [id, initialValue]);

  const [state, setState] = useState<T>(_initialValue);

  useEffect(() => {
    try {
      const stateStr = JSON.stringify(state);
      localStorage.setItem("state:" + id, stateStr);
    } catch (e) {
      console.warn("Failed to save to localStorage:", id, e);
    }
  }, [state, id]);

  return [state, setState];
}
