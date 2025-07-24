import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";

const CharitySignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mission: "",
    location: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Redirect to dashboard if already logged in as a charity
    if (token && role === "charity") {
      navigate("/charity-dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/charity-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("All required fields must be filled");
        } else if (response.status === 409) {
          throw new Error("Email already registered");
        } else {
          throw new Error(data.error || "Failed to submit application");
        }
      }

      navigate("/charity-application-submitted");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
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
                      Charity Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input h-10 px-4 py-2 text-[#0e181b] text-sm font-normal leading-normal bg-white border border-[#d0e1e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f9fbf]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#0e181b] text-sm font-medium leading-normal">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input h-10 px-4 py-2 text-[#0e181b] text-sm font-normal leading-normal bg-white border border-[#d0e1e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f9fbf]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#0e181b] text-sm font-medium leading-normal">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input h-10 px-4 py-2 text-[#0e181b] text-sm font-normal leading-normal bg-white border border-[#d0e1e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f9fbf]"
                      required
                      minLength="6"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#0e181b] text-sm font-medium leading-normal">
                      Mission Statement *
                    </label>
                    <textarea
                      name="mission"
                      value={formData.mission}
                      onChange={handleChange}
                      className="form-input h-20 px-4 py-2 text-[#0e181b] text-sm font-normal leading-normal bg-white border border-[#d0e1e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f9fbf]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#0e181b] text-sm font-medium leading-normal">
                      Location (City, Country)
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input h-10 px-4 py-2 text-[#0e181b] text-sm font-normal leading-normal bg-white border border-[#d0e1e7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3f9fbf]"
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm font-normal leading-normal">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3f9fbf] text-[#0e181b] text-sm font-bold leading-normal tracking-[0.015em] ${isSubmitting ? "opacity-70" : ""}`}
                  >
                    <span className="truncate">
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </span>
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