import { useCallback } from "react";
import type { State, StatePayloadMap, StateUpdate } from "statepack";
import { shallowEqual } from "./shallowEqual.ts";
import {
  type UseExternalStateCallback,
  useExternalState,
} from "./useExternalState.ts";

/**
 * The state setter returned from this hook updates the entire state value,
 * regardless of the selector. The state setter is provided as a convenience,
 * so that an additional hook call and subscription to the state isn't
 * required.
 */
export function useSelectedExternalState<
  V,
  T = unknown,
  P extends StatePayloadMap<T> = StatePayloadMap<T>,
>(
  state: State<T, P>,
  selector: (input: T) => V,
  equal = shallowEqual,
): [V, (update: T | StateUpdate<T>) => void] {
  let callback = useCallback<UseExternalStateCallback<T, P>>(
    (render, { current, previous }) => {
      if (!equal(selector(current), selector(previous))) render();
    },
    [selector, equal],
  );

  let [value, setValue] = useExternalState(state, callback);

  return [selector(value), setValue];
}
