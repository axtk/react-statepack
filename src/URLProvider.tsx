import { type ReactNode, useEffect } from "react";
import { URLState } from "statepack";
import { URLContext } from "./URLContext.ts";
import { useInitialValue } from "./useInitialValue.ts";

export type URLProviderProps = {
  href?: string | URLState | undefined;
  children?: ReactNode;
};

/**
 * This component provides a `URLState` instance to the nested components. Its
 * `href` prop defines the initial value of the provided instance.
 */
export const URLProvider = ({ href, children }: URLProviderProps) => {
  let urlState = useInitialValue(() => {
    if (href instanceof URLState) return href;
    else if (href === undefined || typeof href === "string")
      return new URLState(href);
    else throw new Error("URLProvider's 'href' of unsupported type");
  });

  useEffect(() => {
    urlState.start();

    return () => urlState.stop();
  }, [urlState]);

  return <URLContext.Provider value={urlState}>{children}</URLContext.Provider>;
};
