import { useState } from "react";

type LoginPageProps = {
  onLogin: (
    username: string,
    password: string
  ) => void;
};

function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password");
      return;
    }

    onLogin(username, password);
  };

  return (
    <div className="app">
      <div className="card login-card">
        <h1 className="headers">
          🏏 OCL Login
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />
          </div>

          <div className="login-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="start-button"
          >
            🔐 Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;