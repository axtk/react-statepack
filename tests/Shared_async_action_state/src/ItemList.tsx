import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { useTransientState } from "../../../index.ts";
import { fetchItems as fetchItemsOriginal, type Item } from "./fetchItems.ts";

export function ItemList() {
  const [items, setItems] = useState<Item[]>([]);

  // This hook returns the async action's state and a trackable
  // version of the async action
  const [{ initial, pending, error }, fetchItems] = useTransientState(
    "items",
    fetchItemsOriginal,
  );
  // By using a string key as a parameter, this hook makes the
  // action's state accessible to other components in the app
  // (see `Status.tsx` that accesses this state)

  const loadItems = useCallback(() => {
    // The fetched items can be stored in any app state without
    // affecting the async action state handling
    fetchItems().then(setItems);
  }, [fetchItems]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  if (initial || pending) return <p>Loading...</p>;

  if (error)
    return (
      <div className="error">
        <p>Failed to load items</p>
        <p>
          <button onClick={loadItems}>Reload items</button>
        </p>
      </div>
    );

  return (
    <>
      <p>
        <button onClick={loadItems}>Reload items</button>
      </p>
      <ul>
        {items.map(({ id, text, color }) => (
          <li key={id} style={{ "--color": color } as CSSProperties}>
            <span className="badge" />
            {text}
          </li>
        ))}
      </ul>
    </>
  );
}
