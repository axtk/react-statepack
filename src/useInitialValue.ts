import { useRef } from "react";

/**
 * Captures a value from a creator function exactly once during initialization.
 * The value reference remains identical across all future renders.
 */
export function useInitialValue<T>(create: () => T): T {
  const ref = useRef<{ value: T }>(null);

  if (ref.current === null) {
    ref.current = { value: create() };
  }

  return ref.current.value;
}
