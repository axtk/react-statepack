import { ItemList } from "./ItemList.tsx";
import { Status } from "./Status.tsx";

export function App() {
  return (
    <>
      <p>
        Status: <Status />
      </p>
      <hr />
      <p>Available items:</p>
      <ItemList />
    </>
  );
}
