import { useEffect, useMemo, useRef, useState } from "react";
import { isState, type State, type StatePayloadMap } from "statepack";
import type { RenderCallback } from "./types/RenderCallback.ts";

export type SetExternalStateValue<
  T,
  P extends StatePayloadMap<T> = StatePayloadMap<T>,
> = State<T, P>["setValue"];

export type UseExternalStateCallback<T = unknown, P extends StatePayloadMap<T> = StatePayloadMap<T>> = (render: () => void, { current, previous }: P["update"]) => void;

const defaultRenderCallback = (render: () => void) => render();

export function useExternalState<T, P extends StatePayloadMap<T>>(
  state: State<T, P>,
  callback?: RenderCallback<P["update"]> | boolean,
): [T, SetExternalStateValue<T, P>];

export function useExternalState<
  T,
  P extends StatePayloadMap<T>,
  E extends keyof P,
>(
  state: State<T, P>,
  callback?: RenderCallback<P[E]> | boolean,
  event?: E,
): [T, SetExternalStateValue<T, P>];

export function useExternalState<
  T,
  P extends StatePayloadMap<T>,
  E extends string,
>(
  state: State<T, P>,
  callback: RenderCallback<P[E]> | boolean = defaultRenderCallback,
  event?: E,
): [T, SetExternalStateValue<T, P>] {
  if (!isState<T, P>(state))
    throw new TypeError("'state' is not an instance of State");

  let [, setRevision] = useState(-1);

  let setValue = useMemo(() => state.setValue.bind(state), [state]);
  let initialStateRevision = useRef(state.revision);
  let shouldUpdate = useRef(false);

  useEffect(() => {
    // Start the state if it's not started yet
    state.start();

    if (callback === false) return;

    shouldUpdate.current = true;

    let render = () => {
      // Use `setRevision()` as long as the component is mounted
      if (shouldUpdate.current) setRevision(Math.random());
    };

    let resolvedCallback =
      typeof callback === "function" ? callback : defaultRenderCallback;

    let unsubscribe = state.on(event ?? "update", (payload) => {
      resolvedCallback(render, payload as P[E]);
    });

    if (state.revision !== initialStateRevision.current) render();

    return () => {
      unsubscribe();
      initialStateRevision.current = state.revision;
      shouldUpdate.current = false;
    };
  }, [state, callback, event]);

  return [state.getValue(), setValue];
}
