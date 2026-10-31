import { createContext, useContext, useState } from "react";
import { State, useExternalState } from "../../../index.ts";

const AppContext = createContext<State<{ count: number }> | null>(null);

function Display() {
  const [state] = useExternalState(useContext(AppContext));

  return <span>{state.count}</span>;
}

function PlusButton() {
  // This component doesn't make use of the state value, so we are
  // opting out from subscription to its updates by adding `false`
  const [, setState] = useExternalState(useContext(AppContext), false);

  const handleClick = () => {
    // Same as with setters from `useState()`
    setState((prevState) => ({
      ...prevState,
      count: prevState.count + 1,
    }));
  };

  return <button onClick={handleClick}>+</button>;
}

export function App() {
  const [appState] = useState(() => new State({ count: 42 }));

  return (
    // Instances of `State` can be provided by regular React Contexts
    // like any other data in a React app
    <AppContext.Provider value={appState}>
      <PlusButton /> <Display />
    </AppContext.Provider>
  );
}
