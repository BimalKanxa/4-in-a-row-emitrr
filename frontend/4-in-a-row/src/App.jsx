import { useEffect, useState } from "react";
import UsernameForm from "./components/UsernameForm";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";
import { connectSocket } from "./services/socket";

function App() {
  const [username, setUsername] = useState(null);
  const [game, setGame] = useState(null);

  useEffect(() => {
    connectSocket((data) => {
      if (data.type === "GAME_START" || data.type === "GAME_UPDATE") {
        setGame(data);
      }
    });
  }, []);

  if (!username) {
    return <UsernameForm onJoined={setUsername} />;
  }

  return (
    <div>
      <h1>4 in a Row</h1>

      {game && (
        <GameBoard
          board={game.board}
          gameId={game.gameId}
          status={game.status}
          winner={game.winner}
        />
      )}

      <Leaderboard />
    </div>
  );
}

export default App;
