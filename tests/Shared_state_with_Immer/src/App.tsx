import { produce } from "immer";
import { createContext, useContext, useState } from "react";
import { State, useExternalState } from "../../../index.ts";

const AppContext = createContext<State<{ counter: number }> | null>(null);

function Display() {
  const [state] = useExternalState(useContext(AppContext));

  return <span>{state.counter}</span>;
}

function PlusButton() {
  const [, setCounter] = useExternalState(useContext(AppContext));

  const handleClick = () => {
    // Same as with setters from `useState()`
    setCounter(
      produce((draft) => {
        // Immer makes the code of immutable state updates look like
        // direct mutations, which can facilitate manipulation of nested data.
        draft.counter++;
      }),
    );
  };

  return <button onClick={handleClick}>+</button>;
}

export function App() {
  const [appState] = useState(() => new State({ counter: 42 }));

  return (
    <AppContext.Provider value={appState}>
      <PlusButton /> <Display />
    </AppContext.Provider>
  );
}
