import Cell from "./Cell";
import { sendMessage } from "../services/socket";

const GameBoard = ({ board, gameId, status, winner }) => {
  const handleColumnClick = (col) => {
    if (status !== "ACTIVE") return;
    sendMessage({ type: "MAKE_MOVE", gameId, column: col });
  };

  return (
    <div>
      <h3>Game Board</h3>

      {board.map((row, r) => (
        <div key={r} style={{ display: "flex" }}>
          {row.map((cell, c) => (
            <Cell key={c} value={cell} onClick={() => handleColumnClick(c)} />
          ))}
        </div>
      ))}

      {status === "FINISHED" && (
        <h2>
          {winner === "DRAW" ? "Draw!" : `Winner: ${winner}`}
        </h2>
      )}
    </div>
  );
};

export default GameBoard;
