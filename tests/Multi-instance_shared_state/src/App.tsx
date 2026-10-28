import { createContext, useContext } from "react";
import { select, State, useExternalState } from "../../../index.ts";
import { fetchPoints } from "./fetchPoints.ts";
import { fetchUsers, type User } from "./fetchUsers.ts";

const users = new State<Record<string, User>>({});
const points = new State<Record<string, number>>({});

// The app state can contain as many State instances as needed.
// Splitting the app state into multiple State instances allows for more
// targeted state update subscriptions in components.
const AppContext = createContext({ users, points });

const UserName = ({ id }: { id: string }) => {
  const [name] = useExternalState(...select(
    useContext(AppContext).users,
    (users) => users[id]?.name,
  ));
  return <>{name}</>;
};

const UserPoints = ({ id }: { id: string }) => {
  const [points] = useExternalState(...select(
    useContext(AppContext).points,
    (points) => points[id],
  ));
  return <strong>{points ?? 0}</strong>;
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
