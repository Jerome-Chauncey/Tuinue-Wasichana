import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CharitySignup = () => {
  const [charityName, setCharityName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [missionStatement, setMissionStatement] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Mock API call for testing
    const mockResponse = { status: 201, data: { msg: "User created" } };
    // Uncomment below for actual API call when backend is ready
    /*
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: charityName,
          email,
          password,
          role: 'charity'
        })
      });
      const data = await response.json();
      if (response.status === 201) {
        setSuccess('Application submitted successfully! Awaiting admin approval...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.msg || 'Application failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    */

    // Simulate successful application for testing
    if (charityName && email && password && missionStatement) {
      setSuccess(
        "Application submitted successfully! Awaiting admin approval..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError("Please fill in all fields");
    }
  };

  return (
    <div>
      <h2>Charity Application - Tuinue Wasichana</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Charity Name:</label>
          <input
            type="text"
            value={charityName}
            onChange={(e) => setCharityName(e.target.value)}
            required
          />
        </div>
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
          <label>Mission Statement:</label>
          <textarea
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Application</button>
      </form>
      <p>
        Already registered? <a href="/login">Log In</a>
      </p>
    </div>
  );
};

export default CharitySignup;
