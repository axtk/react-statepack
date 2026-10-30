import { createRoot } from "react-dom/client";
import { State, useExternalState } from "../../index.ts";

const counterState = new State(0);
// `new State(value)` can contain any kind of value,
// of primitive or nonprimitive type

function Counter() {
  const [counter, setCounter] = useExternalState(counterState);

  const handleClick = () => {
    // Same as with setters from `useState()`
    setCounter((value) => value + 1);
  };

  return <button onClick={handleClick}>+ {counter}</button>;
}

function ResetButton() {
  const [, setCounter] = useExternalState(counterState);

  const handleClick = () => {
    setCounter(0);
  };

  return <button onClick={handleClick}>×</button>;
}

function App() {
  return (
    <>
      <Counter /> <ResetButton />
    </>
  );
}

createRoot(document.querySelector("#app")!).render(<App />);
