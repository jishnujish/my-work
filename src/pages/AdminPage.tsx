import { useState } from "react";

import type {
  Player,
  Captain,
} from "../types";

import { supabase } from "../lib/supabase";

type AdminPageProps = {
  players: Player[];
  captains: Captain[];

  setPlayers: React.Dispatch<
    React.SetStateAction<Player[]>
  >;

  setCaptains: React.Dispatch<
    React.SetStateAction<Captain[]>
  >;

  onStartDraft: () => void;

  onLogout: () => void;
};

function AdminPage({
  players,
  captains,
  setPlayers,
  setCaptains,
  onStartDraft,
  onLogout,
}: AdminPageProps) {
  const [playerName, setPlayerName] =
    useState("");

  const [playerList, setPlayerList] =
    useState("");

  const [captainName, setCaptainName] =
    useState("");

  // Selected players for bulk delete
  const [selectedPlayers, setSelectedPlayers] =
    useState<string[]>([]);

  // ==========================================
  // ADD SINGLE PLAYER
  // ==========================================

  const addPlayer = async () => {
    const name = playerName.trim();

    if (!name) return;

    const {
      data,
      error,
    } = await supabase
      .from("players")
      .insert({
        name: name,
        status: "available",
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Add player error:",
        error
      );

      alert(
        "Failed to add player"
      );

      return;
    }

    if (data) {
      setPlayers((current) => [
        ...current,
        data,
      ]);
    }

    setPlayerName("");
  };

  // ==========================================
  // ADD MULTIPLE PLAYERS
  // ==========================================

  const addMultiplePlayers = async () => {
    const names = playerList
      .split("\n")
      .map((line) =>
        line
          .replace(
            /^\s*\d+[.)]\s*/,
            ""
          )
          .trim()
      )
      .filter(Boolean);

    if (names.length === 0) {
      alert(
        "Please enter player names"
      );

      return;
    }

    const playersToInsert =
      names.map((name) => ({
        name: name,
        status: "available" as const,
      }));

    const {
      data,
      error,
    } = await supabase
      .from("players")
      .insert(playersToInsert)
      .select();

    if (error) {
      console.error(
        "Add players error:",
        error
      );

      alert(
        "Failed to add players"
      );

      return;
    }

    if (data) {
      setPlayers((current) => [
        ...current,
        ...data,
      ]);
    }

    setPlayerList("");

    alert(
      `${data?.length || 0} players added successfully`
    );
  };

  // ==========================================
  // DELETE SINGLE PLAYER
  // ==========================================

  const removePlayer = async (
    id: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this player?"
      );

    if (!confirmDelete) return;

    const { error } =
      await supabase
        .from("players")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(
        "Delete player error:",
        error
      );

      alert(
        "Failed to delete player"
      );

      return;
    }

    setPlayers((current) =>
      current.filter(
        (player) =>
          player.id !== id
      )
    );

    // Remove from selected list also
    setSelectedPlayers((current) =>
      current.filter(
        (playerId) =>
          playerId !== id
      )
    );
  };

  // ==========================================
  // SELECT / UNSELECT PLAYER
  // ==========================================

  const togglePlayerSelection = (
    id: string
  ) => {
    setSelectedPlayers((current) =>
      current.includes(id)
        ? current.filter(
            (playerId) =>
              playerId !== id
          )
        : [
            ...current,
            id,
          ]
    );
  };

  // ==========================================
  // SELECT ALL PLAYERS
  // ==========================================

  const selectAllPlayers = () => {
    if (
      selectedPlayers.length ===
      players.length
    ) {
      // Unselect all
      setSelectedPlayers([]);
    } else {
      // Select all
      setSelectedPlayers(
        players.map(
          (player) => player.id
        )
      );
    }
  };

  // ==========================================
  // DELETE SELECTED PLAYERS
  // ==========================================

  const deleteSelectedPlayers =
    async () => {
      if (
        selectedPlayers.length === 0
      ) {
        alert(
          "Please select players to delete"
        );

        return;
      }

      const confirmDelete =
        window.confirm(
          `Are you sure you want to delete ${selectedPlayers.length} selected player(s)?`
        );

      if (!confirmDelete) return;

      const {
        error,
      } = await supabase
        .from("players")
        .delete()
        .in(
          "id",
          selectedPlayers
        );

      if (error) {
        console.error(
          "Bulk delete players error:",
          error
        );

        alert(
          "Failed to delete selected players"
        );

        return;
      }

      setPlayers((current) =>
        current.filter(
          (player) =>
            !selectedPlayers.includes(
              player.id
            )
        )
      );

      setSelectedPlayers([]);

      alert(
        "Selected players deleted successfully"
      );
    };

  // ==========================================
  // ADD CAPTAIN
  // ==========================================

  const addCaptain = async () => {
    const name =
      captainName.trim();

    if (!name) return;

    const {
      data,
      error,
    } = await supabase
      .from("captains")
      .insert({
        name: name,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Add captain error:",
        error
      );

      alert(
        "Failed to add captain"
      );

      return;
    }

    if (data) {
      setCaptains((current) => [
        ...current,
        data,
      ]);
    }

    setCaptainName("");
  };

  // ==========================================
  // DELETE CAPTAIN
  // ==========================================

  const removeCaptain = async (
    id: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this captain?"
      );

    if (!confirmDelete) return;

    const { error } =
      await supabase
        .from("captains")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(
        "Delete captain error:",
        error
      );

      alert(
        "Failed to delete captain"
      );

      return;
    }

    setCaptains((current) =>
      current.filter(
        (captain) =>
          captain.id !== id
      )
    );
  };

  // ==========================================
  // CHECK SELECT ALL STATUS
  // ==========================================

  const allPlayersSelected =
    players.length > 0 &&
    selectedPlayers.length ===
      players.length;

  return (
    <div className="app">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <h1 className="headers">
        🏏 OCL Team Selection
      </h1>

      {/* ================================= */}
      {/* PLAYERS + CAPTAINS */}
      {/* ================================= */}

      <div className="admin-container">

        {/* ================================= */}
        {/* PLAYERS */}
        {/* ================================= */}

        <section className="card">

          {/* PLAYERS HEADER */}

          <div className="players-header">

            <h2 className="headers">
              👤 Players
            </h2>

            {players.length > 0 && (
              <div className="player-actions">

                {/* SELECT ALL */}

                <button
                  className="select-all-button"
                  onClick={
                    selectAllPlayers
                  }
                >
                  {allPlayersSelected
                    ? "☐ Unselect All"
                    : "☑ Select All"}
                </button>

                {/* DELETE SELECTED */}

                <button
                  className="bulk-delete-button"
                  onClick={
                    deleteSelectedPlayers
                  }
                  disabled={
                    selectedPlayers.length ===
                    0
                  }
                >
                  🗑️ Delete Selected
                  {selectedPlayers.length >
                    0 &&
                    ` (${selectedPlayers.length})`}
                </button>

              </div>
            )}

          </div>

          {/* SINGLE PLAYER */}

          <div className="add-row">

            <input
              type="text"
              placeholder="Enter player name"
              value={playerName}
              onChange={(e) =>
                setPlayerName(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  addPlayer();
                }
              }}
            />

            <button
              onClick={addPlayer}
            >
              + Add Player
            </button>

          </div>

          {/* MULTIPLE PLAYERS */}

          <div className="add-row">

            <textarea
              rows={5}
              placeholder={`1. Jishnu
2. Nikhil
3. Akhil
4. Rahul`}
              value={playerList}
              onChange={(e) =>
                setPlayerList(
                  e.target.value
                )
              }
            />

            <button
              onClick={
                addMultiplePlayers
              }
            >
              + Add List
            </button>

          </div>

          {/* PLAYERS LIST */}

          {players.length === 0 ? (

            <p className="empty">
              No players added
            </p>

          ) : (

            players.map(
              (player, index) => (

                <div
                  className="list-item"
                  key={player.id}
                >

                  {/* CHECKBOX + NAME */}
<div className="player-select-wrapper">
  <input
    type="checkbox"
    className="player-checkbox"
    checked={selectedPlayers.includes(player.id)}
    onChange={() => togglePlayerSelection(player.id)}
  />

  <span className="player-name">
    {index + 1}. {player.name}
  </span>
</div>

                  {/* SINGLE DELETE */}

                  <button
                    className="delete-button"
                    onClick={() =>
                      removePlayer(
                        player.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              )
            )

          )}

        </section>

        {/* ================================= */}
        {/* CAPTAINS */}
        {/* ================================= */}

        <section className="card">

          <h2 className="headers">
            👑 Captains
          </h2>

          <div className="add-row">

            <input
              type="text"
              placeholder="Enter captain name"
              value={captainName}
              onChange={(e) =>
                setCaptainName(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  addCaptain();
                }
              }}
            />

            <button
              onClick={
                addCaptain
              }
            >
              + Add Captain
            </button>

          </div>

          {captains.length === 0 ? (

            <p className="empty">
              No captains added
            </p>

          ) : (

            captains.map(
              (captain, index) => (

                <div
                  className="list-item"
                  key={captain.id}
                >

                  <span>
                    👑 {index + 1}.{" "}
                    {captain.name}
                  </span>

                  <button
                    className="delete-button"
                    onClick={() =>
                      removeCaptain(
                        captain.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              )
            )

          )}

        </section>

      </div>

      {/* ================================= */}
      {/* START + LOGOUT */}
      {/* ================================= */}

      <div className="start-container">

        <button
          className="start-button"
          disabled={
            players.length === 0 ||
            captains.length !== 2
          }
          onClick={
            onStartDraft
          }
        >
          🚀 START Selection
        </button>

        <button
          className="back-button"
          onClick={onLogout}
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}

export default AdminPage;