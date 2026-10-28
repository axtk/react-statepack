import { useContext } from "react";
import type { NavigationOptions } from "statepack";
import type { RenderCallback } from "./types/RenderCallback.ts";
import { URLContext } from "./URLContext.ts";
import { useExternalState } from "./useExternalState.ts";

export function useURL(callback?: RenderCallback<NavigationOptions>) {
  return useExternalState(
    useContext(URLContext),
    (route, render) => route.on("navigation", (payload) => {
      if (callback) callback(render, payload);
      else render();
    }),
  );
}
