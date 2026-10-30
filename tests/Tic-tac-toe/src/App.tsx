import { State, useExternalState } from "../../../index.ts";

type BoardState = {
  moves: number[];
  lastMoveIndex: number;
};

type GameState = {
  value: "win" | "draw" | "playing";
  win?: number[];
};

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellValues = ["❌", "⭕"];
// const cellValues = ["🍒", "🍄"];
// const cellValues = ["🦄", "✨"];

function getGameState(state: BoardState): GameState {
  // Too few moves from both players for a game to end
  if (state.lastMoveIndex < 4) return { value: "playing" };

  let moves = state.moves.slice(0, state.lastMoveIndex + 1);

  for (let win of wins) {
    let index = moves.indexOf(win[0]);
    let matchesWin = index !== -1;

    for (let i = 1; i < win.length && matchesWin; i++)
      matchesWin &&= moves.indexOf(win[i]) % 2 === index % 2;

    if (matchesWin) return { value: "win", win };
  }

  // No win, no more moves
  if (moves.length === 9) return { value: "draw" };

  return { value: "playing" };
}

const boardState = new State<BoardState>({ moves: [], lastMoveIndex: -1 });

function Cell({ index, selected }: { index: number; selected?: boolean }) {
  const [state, setState] = useExternalState(boardState);

  // Checking whether the cell index is already among the past moves
  const moveIndex = state.moves.lastIndexOf(index, state.lastMoveIndex);

  const handleClick = () => {
    if (moveIndex === -1)
      setState(({ moves, lastMoveIndex }) => ({
        moves: [...moves.slice(0, lastMoveIndex + 1), index],
        lastMoveIndex: lastMoveIndex + 1,
      }));
  };

  return (
    <button className={selected ? "selected" : undefined} onClick={handleClick}>
      {moveIndex === -1 ? "" : cellValues[moveIndex % 2]}
    </button>
  );
}

const indices = Array.from({ length: 9 }).fill(0);

function Board() {
  const [state] = useExternalState(boardState);
  const { value: status, win } = getGameState(state);

  return (
    <fieldset className="board" disabled={status !== "playing"}>
      {indices.map((_, i) => (
        <Cell index={i} key={i} selected={win?.includes(i)} />
      ))}
    </fieldset>
  );
}

function History() {
  const [state, setState] = useExternalState(boardState);

  const rollbackTo = (moveIndex: number) => {
    setState((state) => ({
      ...state,
      lastMoveIndex: moveIndex,
    }));
  };

  return (
    <ul className="history">
      {state.moves.map((_, i) => (
        <li
          className={i === state.lastMoveIndex ? "selected" : undefined}
          key={i}
        >
          <button onClick={() => rollbackTo(i)}>
            Go to move {i + 1} [{cellValues[i % 2]}]
          </button>
        </li>
      ))}
    </ul>
  );
}

function Controls() {
  const [, setState] = useExternalState(boardState, false);

  const restart = () => {
    setState({ moves: [], lastMoveIndex: -1 });
  };

  return (
    <p className="controls">
      <button onClick={restart}>Restart</button>
    </p>
  );
}

function StatusBar() {
  const [state] = useExternalState(boardState);

  return <p className="status">{getGameState(state).value}</p>;
}

export function App() {
  return (
    <>
      <Board />
      <StatusBar />
      <Controls />
      <History />
    </>
  );
}
