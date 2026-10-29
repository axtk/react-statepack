import { useContext } from "react";
import type { NavigationOptions } from "statepack";
import type { RenderCallback } from "./types/RenderCallback.ts";
import { URLContext } from "./URLContext.ts";
import { useExternalState } from "./useExternalState.ts";

export function useURL(callback?: RenderCallback<NavigationOptions>) {
  let urlState = useContext(URLContext);
  return useExternalState(urlState, (render) =>
    urlState.on("navigation", (payload) => {
      if (callback) callback(render, payload);
      else render();
    }),
  );
}
