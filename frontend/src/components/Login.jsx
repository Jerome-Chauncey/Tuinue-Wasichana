import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor"); // Default to donor
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Mock API call for testing
    const mockResponse = {
      status: 200,
      data: { access_token: "mock_token", role },
    };
    // Uncomment below for actual API call when backend is ready
    /*
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.status === 200) {
        setSuccess('Login successful! Redirecting...');
        const role = data.role || 'donor';
        setTimeout(() => {
          if (role === 'admin') navigate('/admin');
          else if (role === 'charity') navigate('/charity');
          else navigate('/donor');
        }, 2000);
      } else {
        setError(data.msg || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    */

    // Simulate successful login for testing
    if (email && password && role) {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        else if (role === "charity") navigate("/charity");
        else navigate("/donor");
      }, 2000);
    } else {
      setError("Please fill in all fields");
    }
  };

  return (
    <div>
      <h2>Login - Tuinue Wasichana</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="donor">Donor</option>
            <option value="charity">Charity</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Log In</button>
      </form>
      <p>
        New donor? <a href="/donor-signup">Sign Up as a Donor</a>
      </p>
      <p>
        New charity? <a href="/charity-signup">Apply to be a Charity</a>
      </p>
    </div>
  );
};

export default Login;
