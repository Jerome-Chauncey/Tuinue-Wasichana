import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";

const CharitySignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mission, setMission] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Redirect to dashboard if already logged in as a charity
    if (token && role === "charity") {
      navigate("/charity-dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/charity-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, mission }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Email already registered");
        }
        throw new Error("Failed to submit application");
      }

      navigate("/charity-application-submitted");
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
              Charity Sign Up
            </h1>
            <div className="px-4 py-3">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[#0e181b] text-sm font-medium leading-normal">
                      Charity Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input h-10 px-4 py-2 text-[#0e181b] text-sm font-normal leading-normal bg-white border border-[#d0e1e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f9fbf]"
                      required
                    />
                  </div>
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
                      Mission Statement
                    </label>
                    <textarea
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      className="form-input h-20 px-4 py-2 text-[#0e181b] text-sm font-normal leading-normal bg-white border border-[#d0e1e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f9fbf]"
                      required
                    />
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
                    <span className="truncate">Submit Application</span>
                  </button>
                </div>
              </form>
              <div className="flex flex-col gap-2 pt-4">
                <Link
                  to="/login"
                  className="text-[#3f9fbf] text-sm font-normal leading-normal hover:underline"
                >
                  Already have an account? Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharitySignUp;
