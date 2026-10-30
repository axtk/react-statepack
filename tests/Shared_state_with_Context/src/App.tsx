import { createContext, useContext, useState } from "react";
import { State, useExternalState } from "../../../index.ts";

const AppContext = createContext(new State(0));
// `new State(value)` can contain any kind of value,
// of primitive or nonprimitive type

const Counter = () => {
  const [counter, setCounter] = useExternalState(useContext(AppContext));

  const handleClick = () => {
    // Same as with setters from `useState()`
    setCounter((value) => value + 1);
  };

  return <button onClick={handleClick}>+ {counter}</button>;
};

const ResetButton = () => {
  const [, setCounter] = useExternalState(useContext(AppContext));

  const handleClick = () => {
    setCounter(0);
  };

  return <button onClick={handleClick}>×</button>;
};

export const App = () => {
  const [appState] = useState(() => new State(42));

  return (
    // Instances of `State` can be provided by regular React Contexts
    // like any other data in a React app
    <AppContext.Provider value={appState}>
      <Counter /> <ResetButton />
    </AppContext.Provider>
  );
};
