import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("Existing Charities");
  const [charities, setCharities] = useState([]);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Check if admin is logged in
    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    // Fetch charities from backend
    const fetchCharities = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/charities`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          if (response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch charities");
        }
        const data = await response.json();
        setCharities(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCharities();
  }, [navigate]);

  const handleViewCharity = (charity) => {
    alert(`Viewing ${charity.name}: ${charity.mission}`);
  };

  const handleDeleteCharity = async (charityId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/charities`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: charityId, status: "deleted" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete charity");
      }
      setCharities(
        charities.map((charity) =>
          charity.id === charityId ? { ...charity, status: "deleted" } : charity
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApproveCharity = async (charityId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/charities`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: charityId, status: "approved" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to approve charity");
      }
      setCharities(
        charities.map((charity) =>
          charity.id === charityId
            ? { ...charity, status: "approved" }
            : charity
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectCharity = async (charityId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/charities`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: charityId, status: "rejected" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to reject charity");
      }
      setCharities(
        charities.map((charity) =>
          charity.id === charityId
            ? { ...charity, status: "rejected" }
            : charity
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const renderContent = () => {
    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }

    switch (activeSection) {
      case "Existing Charities":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Existing Charities</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Mission</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {charities
                    .filter((c) => c.status === "approved")
                    .map((charity) => (
                      <tr key={charity.id}>
                        <td className="px-4 py-2 border">{charity.name}</td>
                        <td className="px-4 py-2 border">{charity.email}</td>
                        <td className="px-4 py-2 border">{charity.mission}</td>
                        <td className="px-4 py-2 border">
                          <button
                            onClick={() => handleViewCharity(charity)}
                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteCharity(charity.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case "Charities Under Review":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Charities Under Review</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Mission</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {charities
                    .filter((c) => c.status === "pending")
                    .map((charity) => (
                      <tr key={charity.id}>
                        <td className="px-4 py-2 border">{charity.name}</td>
                        <td className="px-4 py-2 border">{charity.email}</td>
                        <td className="px-4 py-2 border">{charity.mission}</td>
                        <td className="px-4 py-2 border">
                          <button
                            onClick={() => handleApproveCharity(charity.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectCharity(charity.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case "Rejected Charities":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Rejected Charities</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Mission</th>
                  </tr>
                </thead>
                <tbody>
                  {charities
                    .filter((c) => c.status === "rejected")
                    .map((charity) => (
                      <tr key={charity.id}>
                        <td className="px-4 py-2 border">{charity.name}</td>
                        <td className="px-4 py-2 border">{charity.email}</td>
                        <td className="px-4 py-2 border">{charity.mission}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">
          Admin Dashboard - Tuinue Wasichana
        </h1>
        <button
          onClick={handleLogOut}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </header>
      <div className="flex">
        <div
          className={`bg-gray-100 p-4 transition-all ${
            isNavCollapsed ? "w-16" : "w-64"
          }`}
        >
          <button onClick={toggleNav} className="text-2xl font-bold mb-4">
            ...
          </button>
          {!isNavCollapsed && (
            <>
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              <ul>
                <li
                  className={`p-2 cursor-pointer ${
                    activeSection === "Existing Charities" ? "bg-gray-300" : ""
                  }`}
                  onClick={() => setActiveSection("Existing Charities")}
                >
                  Existing Charities
                </li>
                <li
                  className={`p-2 cursor-pointer ${
                    activeSection === "Charities Under Review"
                      ? "bg-gray-300"
                      : ""
                  }`}
                  onClick={() => setActiveSection("Charities Under Review")}
                >
                  Charities Under Review
                </li>
                <li
                  className={`p-2 cursor-pointer ${
                    activeSection === "Rejected Charities" ? "bg-gray-300" : ""
                  }`}
                  onClick={() => setActiveSection("Rejected Charities")}
                >
                  Rejected Charities
                </li>
                <li
                  className="p-2 cursor-pointer bg-red-100 mt-4"
                  onClick={handleLogOut}
                >
                  Log Out
                </li>
              </ul>
            </>
          )}
        </div>
        <div className="flex-1 p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
