import type { Player, Captain, Teams } from "../types";

type DraftPageProps = {
  players: Player[];
  captains: Captain[];
  teams: Teams;

  selectPlayer: (
    player: Player,
    captainId: string
  ) => void;

  onBack: () => void;
};

function DraftPage({
  players,
  captains,
  teams,
  selectPlayer,
  onBack,
}: DraftPageProps) {
  return (
    <div className="app">
      <h1 className="headers">🏏 Player Selection</h1>

      <div className="draft-page">

        {/* Available Players */}
        <section className="card available">
          <h2 className="headers">🏏 Available Players</h2>

          {players.length === 0 ? (
            <p>All players have been selected 🎉</p>
          ) : (
            players.map((player) => (
              <div
                className="player-card"
                key={player.id}
              >
                <strong className="headers">{player.name}</strong>

                <div className="captain-buttons">
                  {captains.map((captain) => (
                    <button
                      key={captain.id}
                      onClick={() =>
                        selectPlayer(
                          player,
                          captain.id
                        )
                      }
                    >
                      {captain.name}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Teams */}
        <section className="teams-container">
          {captains.map((captain) => (
            <div
              className="card team"
              key={captain.id}
            >
              <h2 className="headers">👑 {captain.name}</h2>

              {teams[captain.id]?.length ? (
                teams[captain.id].map((player) => (
                  <div
                    className="headers"
                    key={player.id}
                  >
                    {player.name}
                  </div>
                ))
              ) : (
                <p className="headers">No players selected</p>
              )}
            </div>
          ))}
        </section>

      </div>

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Admin
      </button>
    </div>
  );
}

export default DraftPage;