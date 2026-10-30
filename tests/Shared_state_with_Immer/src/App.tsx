import { produce } from "immer";
import { createContext, useContext, useState } from "react";
import { State, useExternalState } from "../../../index.ts";

const AppContext = createContext(new State({ counter: 0 }));

const Display = () => {
  const [state] = useExternalState(useContext(AppContext));

  return <span>{state.counter}</span>;
};

const PlusButton = () => {
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
};

export const App = () => {
  const [appState] = useState(() => new State({ counter: 42 }));

  return (
    <AppContext.Provider value={appState}>
      <PlusButton /> <Display />
    </AppContext.Provider>
  );
};
