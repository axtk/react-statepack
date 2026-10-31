import { createContext, useContext } from "react";
import { State, useExternalState, useInitialValue } from "../../../index.ts";

const AppContext = createContext<State<number> | null>(null);

function Counter() {
  const [count, setCount] = useExternalState(useContext(AppContext));

  const handleClick = () => {
    // Same as with setters from `useState()`
    setCount((value) => value + 1);
  };

  return <button onClick={handleClick}>+ {count}</button>;
}

function ResetButton() {
  const [, setCount] = useExternalState(useContext(AppContext));

  const handleClick = () => {
    setCount(0);
  };

  return <button onClick={handleClick}>×</button>;
}

export function App() {
  const appState = useInitialValue(() => new State(42));

  return (
    // Instances of `State` can be provided by regular React Contexts
    // like any other data in a React app
    <AppContext.Provider value={appState}>
      <Counter /> <ResetButton />
    </AppContext.Provider>
  );
}
