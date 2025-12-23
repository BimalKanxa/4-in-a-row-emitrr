import { useState } from "react";
import { sendMessage } from "../services/socket";

const UsernameForm = ({ onJoined }) => {
  const [username, setUsername] = useState("");

  const joinGame = () => {
    if (!username) return;
    sendMessage({ type: "JOIN_QUEUE", username });
    onJoined(username);
  };

  return (
    <div>
      <h2>Enter Username</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button onClick={joinGame}>Join Game</button>
    </div>
  );
};

export default UsernameForm;
