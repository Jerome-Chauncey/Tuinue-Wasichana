import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Donor");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Redirect to appropriate dashboard if already logged in
    if (token && role === "donor") {
      navigate("/donor-dashboard");
    } else if (token && role === "charity") {
      // Charity status check requires async call to /api/charity-status
      const checkCharityStatus = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/charity-status",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const { status } = await response.json();
            if (status === "approved") {
              navigate("/charity-approved");
            } else if (status === "pending") {
              navigate("/charity-pending");
            } else if (status === "rejected") {
              navigate("/charity-rejected");
            }
          } else {
            setError("Failed to verify charity status");
          }
        } catch (err) {
          setError("Error checking charity status");
        }
      };
      if (role === "charity") {
        checkCharityStatus();
      }
    } else if (token && role === "admin") {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: userType.toLowerCase(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid email or password");
        } else if (response.status === 403) {
          const { error } = await response.json();
          throw new Error(error);
        } else {
          throw new Error("Login failed");
        }
      }

      const { token, role, charityStatus } = await response.json();

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "donor") {
        navigate("/donor-dashboard");
      } else if (role === "charity") {
        if (charityStatus === "approved") {
          navigate("/charity-approved");
        } else if (charityStatus === "pending") {
          navigate("/charity-pending");
        } else if (charityStatus === "rejected") {
          navigate("/charity-rejected");
        } else {
          setError("Invalid charity status");
        }
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        setError("Invalid user role");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7f0f3] px-10 py-3">
          <div className="flex items-center gap-4 text-[#0e181b]">
            <h2 className="text-[#0e181b] text-lg font-bold leading-tight tracking-[-0.015em]">
              Tuinue Wasichana
            </h2>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <h1 className="text-[#0e181b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Login
            </h1>
            <div className="px-4 py-3">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[#0e181b] text-sm font-medium leading-normal">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input h-10 px-4 py-2 text-[#0e181b] text-sm font-normal leading-normal bg-white border border-[#d0e1e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f9fbf]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#0e181b] text-sm font-medium leading-normal">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input h-10 px-4 py-2 text-[#0e181b] text-sm font-normal leading-normal bg-white border border-[#d0e1e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f9fbf]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#0e181b] text-sm font-medium leading-normal">
                      User Type
                    </label>
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="form-select h-10 px-4 py-2 text-[#0e181b] text-sm font-normal leading-normal bg-white border border-[#d0e1e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f9fbf]"
                    >
                      <option value="Donor">Donor</option>
                      <option value="Charity">Charity</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm font-normal leading-normal">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3f9fbf] text-[#0e181b] text-sm font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Login</span>
                  </button>
                </div>
              </form>
              <div className="flex flex-col gap-2 pt-4">
                <a
                  href="/donor-signup"
                  className="text-[#3f9fbf] text-sm font-normal leading-normal hover:underline"
                >
                  Sign up as a Donor
                </a>
                <a
                  href="/charity-signup"
                  className="text-[#3f9fbf] text-sm font-normal leading-normal hover:underline"
                >
                  Sign up as a Charity
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
