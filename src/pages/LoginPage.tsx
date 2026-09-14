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
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-bg-circle circle-one"></div>
      <div className="login-bg-circle circle-two"></div>

      <div className="login-container">
        {/* Logo / Header */}
        <div className="login-header">
          <div className="cricket-logo">🏏</div>

          <h1>OCL</h1>

          <p>Online Cricket League</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-title">
            <h2>Welcome Back 👋</h2>

            <p>
              Login to continue to your
              <br />
              cricket league
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="login-field">
              <label htmlFor="username">
                Username
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  👤
                </span>

                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
            >
              <span>🔐</span>
              Login
            </button>
          </form>

          <div className="login-footer">
            <span>🏏</span>
            <p>Play • Draft • Win</p>
            <span>🏆</span>
          </div>
        </div>

        <p className="copyright">
          © 2026 OCL • Online Cricket League
        </p>
      </div>
    </div>
  );
}

export default LoginPage;