import type {
  Player,
  Captain,
  Teams,
} from "../types";

type DraftPageProps = {
  players: Player[];
  captains: Captain[];
  teams: Teams;

  selectPlayer: (
    player: Player,
    captainId: string
  ) => void;

  undoLastSelection: () => void;

  onBack: () => void;
};

function DraftPage({
  players,
  captains,
  teams,
  selectPlayer,
  undoLastSelection,
  onBack,
}: DraftPageProps) {

  // ==========================================
  // AVAILABLE PLAYERS
  // ==========================================

  const availablePlayers =
    players.filter(
      (player) =>
        player.status === "available"
    );

  // ==========================================
  // SELECTED PLAYER COUNT
  // ==========================================

  const selectedPlayerCount =
    players.filter(
      (player) =>
        player.status === "selected"
    ).length;

  // ==========================================
  // ACTIVE CAPTAIN
  // ==========================================

  const activeCaptain =
    captains.length > 0
      ? captains[
          selectedPlayerCount %
            captains.length
        ]
      : undefined;

  const activeCaptainId =
    activeCaptain?.id || "";

  return (
    <div className="app">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <h1 className="headers">
        🏏 Player Selection
      </h1>

      {/* ================================= */}
      {/* CURRENT TURN */}
      {/* ================================= */}

      {activeCaptain && (
        <h2 className="headers">
          🎯 {activeCaptain.name}'s Turn
        </h2>
      )}

      {/* ================================= */}
      {/* UNDO BUTTON */}
      {/* ================================= */}

      <button
        className="undo-button"
        onClick={undoLastSelection}
      >
        ↩️ Undo Last Selection
      </button>

      {/* ================================= */}
      {/* DRAFT PAGE */}
      {/* ================================= */}

      <div className="draft-page">

        {/* ================================= */}
        {/* AVAILABLE PLAYERS */}
        {/* ================================= */}

        <section className="card available">

          <h2 className="headers">
            🏏 Available Players
          </h2>

          {availablePlayers.length === 0 ? (

            <p>
              All players have been selected 🎉
            </p>

          ) : (

            availablePlayers.map(
              (player) => (

                <div
                  className="player-card"
                  key={player.id}
                >

                  {/* PLAYER NAME */}

                  <strong className="headers">
                    {player.name}
                  </strong>

                  {/* ================================= */}
                  {/* CAPTAIN BUTTONS */}
                  {/* ================================= */}

                  <div className="captain-buttons">

                    {captains.map(
                      (captain) => {

                        const isActive =
                          captain.id ===
                          activeCaptainId;

                        return (
                          <button
                            key={captain.id}
                            disabled={!isActive}
                            className={
                              isActive
                                ? "active-captain-button"
                                : "inactive-captain-button"
                            }
                            onClick={() =>
                              selectPlayer(
                                player,
                                captain.id
                              )
                            }
                          >
                            {captain.name}
                          </button>
                        );
                      }
                    )}

                  </div>

                </div>
              )
            )
          )}

        </section>

        {/* ================================= */}
        {/* TEAMS */}
        {/* ================================= */}

        <section className="teams-container">

          {captains.map(
            (captain) => (

              <div
                className="card team"
                key={captain.id}
              >

                {/* CAPTAIN NAME */}

                <h2 className="headers">
                  👑 {captain.name}
                </h2>

                {/* SELECTED PLAYERS */}

                {teams[captain.id]?.length ? (

                  teams[captain.id].map(
                    (player, index) => (

                      <div
                        className="headers"
                        key={player.id}
                      >
                        {index + 1}.{" "}
                        {player.name}
                      </div>

                    )
                  )

                ) : (

                  <p className="headers">
                    No players selected
                  </p>

                )}

              </div>
            )
          )}

        </section>

      </div>

      {/* ================================= */}
      {/* LOGOUT */}
      {/* ================================= */}

      <button
        className="back-button"
        onClick={onBack}
      >
        🚪 Logout
      </button>

    </div>
  );
}

export default DraftPage;