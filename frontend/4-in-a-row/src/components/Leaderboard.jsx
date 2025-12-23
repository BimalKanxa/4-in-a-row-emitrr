import { useEffect, useState } from "react";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard`)
      .then(res => res.json())
      .then(setLeaders);
  }, []);

  return (
    <div>
      <h3>Leaderboard</h3>
      <ul>
       { leaders && leaders.map((l, i) => (
          <li key={i}>
            {l.winner} - {l.wins} wins
          </li>
        ))
    }
      </ul>
    </div>
  );
};

export default Leaderboard;
