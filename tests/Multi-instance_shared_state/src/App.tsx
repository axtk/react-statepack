import { createContext, useContext } from "react";
import { State, useExternalState } from "../../../index.ts";
import { fetchPoints } from "./fetchPoints.ts";
import { fetchUsers, type User } from "./fetchUsers.ts";

const users = new State<Record<string, User>>({});
const points = new State<Record<string, number>>({});

// The app state can contain as many State instances as needed.
// Splitting the app state into multiple State instances allows for more
// targeted state update subscriptions in components.
const AppContext = createContext({ users, points });

const UserName = ({ id }: { id: string }) => {
  const [users] = useExternalState(
    useContext(AppContext).users,
    // The hook callback allows to filter irrelevant state updates.
    // This component will only re-render if it receives an updated user name
    // for the given user ID.
    (render, { current, previous }) => {
      if (current[id]?.name !== previous[id]?.name) render();
    },
  );

  return <>{users[id]?.name}</>;
};

const UserPoints = ({ id }: { id: string }) => {
  const [points] = useExternalState(
    useContext(AppContext).points,
    (render, { current, previous }) => {
      if (current[id] !== previous[id]) render();
    },
  );

  return <strong>{points[id] ?? 0}</strong>;
};

const TableRow = ({ id }: { id: string }) => (
  <tr>
    <td>
      <UserName id={id} />
    </td>
    <td>
      <UserPoints id={id} />
    </td>
  </tr>
);

fetchUsers().then((value) => {
  // State instances don't depend on React, so they can be used both inside and
  // outside of React components. With SSR though, state manipulation outside
  // of a React Context should be avoided in order to avoid cross-request data
  // sharing.
  users.setValue(value);
});

function updatePoints() {
  fetchPoints().then((value) => {
    points.setValue(value);
    setTimeout(updatePoints, 2000);
  });
}

updatePoints();

export const App = () => (
  <table>
    <thead>
      <tr>
        <td>User</td>
        <td>Points</td>
      </tr>
    </thead>
    <tbody>
      <TableRow id="jane" />
      <TableRow id="jack" />
    </tbody>
  </table>
);
