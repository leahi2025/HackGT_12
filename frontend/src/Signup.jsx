import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // default role
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Account created successfully! Welcome ${data.user.email}`);
        // Optionally redirect to login after successful signup
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-app">
      {/* Header */}
      <header className="app-header">
        <h1>EchoHealth</h1>
        <p className="patient-info">
          Create your account to get started
        </p>
      </header>

      {/* Signup Content */}
      <main className="signup-content">
        <div className="signup-card">
          <div className="signup-header">
            <h2>Create Account</h2>
            <p>Join EchoHealth to streamline your healthcare documentation</p>
          </div>
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="signup-input"
              />
            </div>
            
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="signup-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="role">Account Type</label>
              <select 
                id="role"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="signup-select"
              >
                <option value="patient">Patient</option>
                <option value="hcp">Healthcare Provider</option>
              </select>
              <p className="role-description">
                {role === "patient" 
                  ? "Access your medical records and track your health data"
                  : "Manage patient records and clinical documentation"
                }
              </p>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`signup-button ${loading ? 'loading' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          {message && (
            <div className={`signup-message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="signup-footer">
            <p>Already have an account? <a href="/login">Sign in here</a></p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
