import { useEffect, useMemo, useRef, useState } from "react";
import { isState, type State, type StatePayloadMap } from "statepack";

export type Subscribe<
  T,
  P extends StatePayloadMap<T> = StatePayloadMap<T>,
> = (state: State<T, P>, render: () => void) => void | (() => void);

export type SetExternalStateValue<
  T,
  P extends StatePayloadMap<T> = StatePayloadMap<T>,
> = State<T, P>["setValue"];

export function useExternalState<
  T,
  P extends StatePayloadMap<T>,
  V = T,
>(
  state: State<T, P>,
  subscribe?: Subscribe<T, P> | boolean,
  getSnapshot?: (state: State<T, P>) => V,
): [V, SetExternalStateValue<T, P>] {
  if (!isState<T, P>(state))
    throw new TypeError("'state' is not an instance of State");

  let [, setRevision] = useState(-1);

  let setValue = useMemo(() => state.setValue.bind(state), [state]);
  let initialStateRevision = useRef(state.revision);
  let shouldUpdate = useRef(false);

  useEffect(() => {
    // Start the state if it's not started yet
    state.start();

    if (subscribe === false) return;

    shouldUpdate.current = true;

    let render = () => {
      // Use `setRevision()` as long as the component is mounted
      if (shouldUpdate.current) setRevision(Math.random());
    };

    let cleanup = typeof subscribe === "function"
      ? subscribe(state, render)
      : state.on("update", render);

    if (state.revision !== initialStateRevision.current) render();

    return () => {
      cleanup?.();
      initialStateRevision.current = state.revision;
      shouldUpdate.current = false;
    };
  }, [state, subscribe]);

  let value = getSnapshot === undefined
    ? state.getValue() as unknown as V
    : getSnapshot(state);

  return [value, setValue];
}
