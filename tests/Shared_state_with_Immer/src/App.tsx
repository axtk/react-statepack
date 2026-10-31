import { produce } from "immer";
import { createContext, useContext } from "react";
import { State, useExternalState, useInitialValue } from "../../../index.ts";

const AppContext = createContext<State<{ count: number }> | null>(null);

function Display() {
  const [state] = useExternalState(useContext(AppContext));

  return <span>{state.count}</span>;
}

function PlusButton() {
  const [, setState] = useExternalState(useContext(AppContext));

  const handleClick = () => {
    // Same as with setters from `useState()`
    setState(
      produce((draft) => {
        // Immer makes the code of immutable state updates look like
        // direct mutations, which can facilitate manipulation of nested data.
        draft.count++;
      }),
    );
  };

  return <button onClick={handleClick}>+</button>;
}

export function App() {
  const appState = useInitialValue(() => new State({ count: 42 }));

  return (
    <AppContext.Provider value={appState}>
      <PlusButton /> <Display />
    </AppContext.Provider>
  );
}
