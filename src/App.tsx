import { useEffect, useState } from "react";

import AdminPage from "./pages/AdminPage";
import DraftPage from "./pages/DraftPage";
import LoginPage from "./pages/LoginPage";

import type {
  Player,
  Captain,
  Teams,
} from "./types";

import { supabase } from "./lib/supabase";

import "./App.css";

function App() {
  // ==========================================
  // LOGIN STATE
  // ==========================================

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  // ==========================================
  // DRAFT STATE
  // ==========================================

  const [isDraftStarted, setIsDraftStarted] =
    useState(false);

  const [players, setPlayers] =
    useState<Player[]>([]);

  const [captains, setCaptains] =
    useState<Captain[]>([]);

  const [teams, setTeams] =
    useState<Teams>({});

  // ==========================================
  // ACTIVE CAPTAIN
  // ==========================================

  const [activeCaptainId, setActiveCaptainId] =
    useState<string>("");

  // ==========================================
  // 1. LOAD DATA FROM SUPABASE
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      // ------------------------------
      // Load Players
      // ------------------------------

      const {
        data: playersData,
        error: playersError,
      } = await supabase
        .from("players")
        .select("*");

      if (playersError) {
        console.error(
          "Players load error:",
          playersError
        );
      } else if (playersData) {
        setPlayers(playersData);
      }

      // ------------------------------
      // Load Captains
      // ------------------------------

      const {
        data: captainsData,
        error: captainsError,
      } = await supabase
        .from("captains")
        .select("*");

      if (captainsError) {
        console.error(
          "Captains load error:",
          captainsError
        );
      } else if (captainsData) {
        setCaptains(captainsData);

        // First captain gets first turn
        if (captainsData.length > 0) {
          setActiveCaptainId(
            captainsData[0].id
          );
        }
      }
    };

    loadData();
  }, []);

  // ==========================================
  // 2. REALTIME - PLAYERS
  // ==========================================

  useEffect(() => {
    const playerChannel = supabase
      .channel("players-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
        },
        (payload) => {
          console.log(
            "PLAYER REALTIME EVENT:",
            payload
          );

          // PLAYER INSERT
          if (payload.eventType === "INSERT") {
            const newPlayer =
              payload.new as Player;

            setPlayers((currentPlayers) => {
              const alreadyExists =
                currentPlayers.some(
                  (player) =>
                    player.id === newPlayer.id
                );

              if (alreadyExists) {
                return currentPlayers;
              }

              return [
                ...currentPlayers,
                newPlayer,
              ];
            });
          }

          // PLAYER UPDATE
          if (payload.eventType === "UPDATE") {
            const updatedPlayer =
              payload.new as Player;

            setPlayers((currentPlayers) =>
              currentPlayers.map((player) =>
                player.id === updatedPlayer.id
                  ? updatedPlayer
                  : player
              )
            );
          }

          // PLAYER DELETE
          if (payload.eventType === "DELETE") {
            const deletedPlayer =
              payload.old as Player;

            setPlayers((currentPlayers) =>
              currentPlayers.filter(
                (player) =>
                  player.id !== deletedPlayer.id
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log(
          "Players realtime status:",
          status
        );
      });

    return () => {
      supabase.removeChannel(
        playerChannel
      );
    };
  }, []);

  // ==========================================
  // 3. REALTIME - CAPTAINS
  // ==========================================

  useEffect(() => {
    const captainChannel = supabase
      .channel("captains-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "captains",
        },
        (payload) => {
          console.log(
            "CAPTAIN REALTIME EVENT:",
            payload
          );

          // CAPTAIN INSERT
          if (payload.eventType === "INSERT") {
            const newCaptain =
              payload.new as Captain;

            setCaptains((currentCaptains) => {
              const alreadyExists =
                currentCaptains.some(
                  (captain) =>
                    captain.id ===
                    newCaptain.id
                );

              if (alreadyExists) {
                return currentCaptains;
              }

              return [
                ...currentCaptains,
                newCaptain,
              ];
            });
          }

          // CAPTAIN UPDATE
          if (payload.eventType === "UPDATE") {
            const updatedCaptain =
              payload.new as Captain;

            setCaptains((currentCaptains) =>
              currentCaptains.map(
                (captain) =>
                  captain.id ===
                  updatedCaptain.id
                    ? updatedCaptain
                    : captain
              )
            );
          }

          // CAPTAIN DELETE
          if (payload.eventType === "DELETE") {
            const deletedCaptain =
              payload.old as Captain;

            setCaptains((currentCaptains) =>
              currentCaptains.filter(
                (captain) =>
                  captain.id !==
                  deletedCaptain.id
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log(
          "Captains realtime status:",
          status
        );
      });

    return () => {
      supabase.removeChannel(
        captainChannel
      );
    };
  }, []);

  // ==========================================
  // 4. CREATE TEAMS
  // ==========================================

  useEffect(() => {
    const newTeams: Teams = {};

    players.forEach((player) => {
      if (
        player.status === "selected" &&
        player.captain_id
      ) {
        if (
          !newTeams[player.captain_id]
        ) {
          newTeams[player.captain_id] = [];
        }

        newTeams[
          player.captain_id
        ].push(player);
      }
    });

    setTeams(newTeams);
  }, [players]);

  // ==========================================
  // 5. LOGIN
  // ==========================================

  const handleLogin = (
    username: string,
    password: string
  ) => {
    // ADMIN
    if (
      username === "admin" &&
      password === "admin123"
    ) {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setIsDraftStarted(false);

      return;
    }

    // NORMAL USER
    if (
      username === "user" &&
      password === "user123"
    ) {
      setIsLoggedIn(true);
      setIsAdmin(false);

      // User directly enters selection page
      setIsDraftStarted(true);

      return;
    }

    alert(
      "Invalid username or password"
    );
  };

  // ==========================================
  // 6. SELECT PLAYER
  // ==========================================

  const selectPlayer = async (
    player: Player,
    captainId: string
  ) => {
    // Only active captain can select
    if (
      captainId !== activeCaptainId
    ) {
      return;
    }

    // Update Supabase
    const {
      data,
      error,
    } = await supabase
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
      console.error(
        "Select player error:",
        error
      );

      alert(
        "Player selection failed"
      );

      return;
    }

    if (data) {
      // Update local state
      setPlayers((currentPlayers) =>
        currentPlayers.map((p) =>
          p.id === data.id
            ? data
            : p
        )
      );

      // =====================================
      // CHANGE TURN TO OTHER CAPTAIN
      // =====================================

      const nextCaptain =
        captains.find(
          (captain) =>
            captain.id !== captainId
        );

      if (nextCaptain) {
        setActiveCaptainId(
          nextCaptain.id
        );
      }
    }
  };

  // ==========================================
  // 7. LOGOUT
  // ==========================================

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsDraftStarted(false);
  };

  // ==========================================
  // 8. LOGIN PAGE
  // ==========================================

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  // ==========================================
  // 9. ADMIN PAGE
  // ==========================================

  if (isAdmin) {
    return (
      <AdminPage
        players={players}
        captains={captains}
        setPlayers={setPlayers}
        setCaptains={setCaptains}
        onStartDraft={() => {
          setIsDraftStarted(true);
        }}
        onLogout={handleLogout}
      />
    );
  }

  // ==========================================
  // 10. DRAFT PAGE
  // ==========================================

  return (
    <DraftPage
      players={players}
      captains={captains}
      teams={teams}
      selectPlayer={selectPlayer}
      activeCaptainId={
        activeCaptainId
      }
      onBack={handleLogout}
    />
  );
}

export default App;