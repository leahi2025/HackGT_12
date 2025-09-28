import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful!");
        console.log("User:", data.user);

        localStorage.setItem("token", data.session.access_token);
        localStorage.setItem("userId", data.user.id);
        
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="medical-app">
      {/* Header */}
      <header className="app-header">
        <h1>EchoHealth</h1>
        <p className="patient-info">
          Welcome back - Please sign in to your account
        </p>
      </header>

      {/* Login Content */}
      <main className="login-content">
        <div className="login-card">
          <div className="login-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
              />
            </div>
            
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
            </div>
            
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
          
          {message && (
            <div className={`login-message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Login;
