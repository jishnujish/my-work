import { useEffect, useState } from "react";
import AdminPage from "./pages/AdminPage";
import DraftPage from "./pages/DraftPage";
import type { Player, Captain, Teams } from "./types";
import { supabase } from "./lib/supabase";

import "./App.css";

function App() {
  const [isDraftStarted, setIsDraftStarted] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [teams, setTeams] = useState<Teams>({});

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      const { data: playersData, error: playersError } =
        await supabase
          .from("players")
          .select("*");

      const { data: captainsData, error: captainsError } =
        await supabase
          .from("captains")
          .select("*");

      if (playersError) {
        console.error("Players error:", playersError);
      }

      if (captainsError) {
        console.error("Captains error:", captainsError);
      }

      if (playersData) {
        setPlayers(playersData);
      }

      if (captainsData) {
        setCaptains(captainsData);
      }
    };

    loadData();
  }, []);

 const selectPlayer = async (
  player: Player,
  captainId: string
) => {
  const { data, error } = await supabase
    .from("players")
    .update({
      status: "selected",
      captain_id: captainId,
    })
    .eq("id", player.id)
    .eq("status", "available")
    .select()
    .single();

  if (error) {
    console.error("Select player error:", error);
    alert("Player selection failed");
    return;
  }

  if (data) {
    // Remove from available players
    setPlayers((currentPlayers) =>
      currentPlayers.filter(
        (p) => p.id !== player.id
      )
    );

    // Add to captain's team
    setTeams((currentTeams) => ({
      ...currentTeams,
      [captainId]: [
        ...(currentTeams[captainId] || []),
        data,
      ],
    }));
  }
};

  if (!isDraftStarted) {
    return (
      <AdminPage
        players={players}
        captains={captains}
        setPlayers={setPlayers}
        setCaptains={setCaptains}
        onStartDraft={() =>
          setIsDraftStarted(true)
        }
      />
    );
  }

  return (
    <DraftPage
      players={players}
      captains={captains}
      teams={teams}
      selectPlayer={selectPlayer}
      onBack={() =>
        setIsDraftStarted(false)
      }
    />
  );
}

export default App;