import { useState } from "react";
import type { Player, Captain } from "../types";
import { supabase } from "../lib/supabase";

type AdminPageProps = {
  players: Player[];
  captains: Captain[];

  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setCaptains: React.Dispatch<React.SetStateAction<Captain[]>>;

  onStartDraft: () => void;
};

function AdminPage({
  players,
  captains,
  setPlayers,
  setCaptains,
  onStartDraft,
}: AdminPageProps) {
  const [playerName, setPlayerName] = useState("");
  const [captainName, setCaptainName] = useState("");

  // Add Player
  const addPlayer = async () => {
    const name = playerName.trim();

    if (!name) return;

    const { data, error } = await supabase
      .from("players")
      .insert({
        name: name,
        status: "available",
      })
      .select()
      .single();

    if (error) {
      console.error("Add player error:", error);
      alert("Failed to add player");
      return;
    }

    if (data) {
      setPlayers((current) => [...current, data]);
    }

    setPlayerName("");
  };

  // Delete Player
  const removePlayer = async (id: string) => {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete player error:", error);
      alert("Failed to delete player");
      return;
    }

    setPlayers((current) =>
      current.filter((player) => player.id !== id)
    );
  };

  // Add Captain
  const addCaptain = async () => {
    const name = captainName.trim();

    if (!name) return;

    const { data, error } = await supabase
      .from("captains")
      .insert({
        name: name,
      })
      .select()
      .single();

    if (error) {
      console.error("Add captain error:", error);
      alert("Failed to add captain");
      return;
    }

    if (data) {
      setCaptains((current) => [...current, data]);
    }

    setCaptainName("");
  };

  // Delete Captain
  const removeCaptain = async (id: string) => {
    const { error } = await supabase
      .from("captains")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete captain error:", error);
      alert("Failed to delete captain");
      return;
    }

    setCaptains((current) =>
      current.filter((captain) => captain.id !== id)
    );
  };

  return (
    <div className="app">
      <h1 className="headers">🏏 OCL Team Selection</h1>

      <div className="admin-container">

        {/* Players */}
        <section className="card">
          <h2 className="headers">👤 Players</h2>

          <div className="add-row">
            <input
              type="text"
              placeholder="Enter player name"
              value={playerName}
              onChange={(e) =>
                setPlayerName(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addPlayer();
                }
              }}
            />

            <button onClick={addPlayer}>
              + Add Player
            </button>
          </div>

          {players.length === 0 ? (
            <p className="empty">No players added</p>
          ) : (
            players.map((player, index) => (
              <div
                className="list-item"
                key={player.id}
              >
                <span>
                  {index + 1}. {player.name}
                </span>

                <button
                  className="delete-button"
                  onClick={() =>
                    removePlayer(player.id)
                  }
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </section>

        {/* Captains */}
        <section className="card">
          <h2 className="headers">👑 Captains</h2>

          <div className="add-row">
            <input
              type="text"
              placeholder="Enter captain name"
              value={captainName}
              onChange={(e) =>
                setCaptainName(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addCaptain();
                }
              }}
            />

            <button onClick={addCaptain}>
              + Add Captain
            </button>
          </div>

          {captains.length === 0 ? (
            <p className="empty">No captains added</p>
          ) : (
            captains.map((captain, index) => (
              <div
                className="list-item"
                key={captain.id}
              >
                <span>
                  👑 {index + 1}. {captain.name}
                </span>

                <button
                  className="delete-button"
                  onClick={() =>
                    removeCaptain(captain.id)
                  }
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </section>

      </div>

      {/* Start Draft */}
      <div className="start-container">
        <button
          className="start-button"
          disabled={
            players.length === 0 ||
            captains.length === 0
          }
          onClick={onStartDraft}
        >
          🚀 START Selection
        </button>
      </div>
    </div>
  );
}

export default AdminPage;