import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("Existing Charities");
  const [charities, setCharities] = useState([]);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInAdmin = JSON.parse(
      localStorage.getItem("loggedInAdmin") || "{}"
    );
    if (!loggedInAdmin.email) {
      navigate("/login");
      return;
    }

    // Seed initial data if charities is empty
    let storedCharities = JSON.parse(localStorage.getItem("charities") || "[]");
    if (storedCharities.length === 0) {
      storedCharities = [
        {
          id: 1,
          name: "Hope for Girls",
          email: "hope@example.org",
          mission: "Empowering girls through education and mentorship.",
          status: "approved",
          donors: [
            { name: "Anonymous", email: "anonymous@email.com" },
            { name: "Sophia Carter", email: "sophia.carter@email.com" },
            { name: "Liam Bennett", email: "liam.bennett@email.com" },
            { name: "Ava Harper", email: "ava.harper@email.com" },
          ],
          beneficiaries: [
            { name: "Sophia Adebayo", donor: "Sophia Carter" },
            { name: "Fatima Diallo", donor: "Liam Bennett" },
            { name: "Aisha Kone", donor: "Ava Harper" },
          ],
          oneTimeDonations: [
            {
              donor: "Anonymous",
              email: "anonymous@email.com",
              amount: "$100",
              date: "2025-08-15",
            },
            {
              donor: "Sophia Carter",
              email: "sophia.carter@email.com",
              amount: "$50",
              date: "2025-08-10",
            },
            {
              donor: "Liam Bennett",
              email: "liam.bennett@email.com",
              amount: "$75",
              date: "2025-07-20",
            },
            {
              donor: "Ava Harper",
              email: "ava.harper@email.com",
              amount: "$150",
              date: "2025-07-10",
            },
          ],
          recurringDonations: [
            {
              donor: "Anonymous",
              email: "anonymous@email.com",
              amount: "$25",
              startDate: "2025-07-15",
              billingDate: "2025-08-15",
            },
            {
              donor: "Sophia Carter",
              email: "sophia.carter@email.com",
              amount: "$50",
              startDate: "2025-08-01",
              billingDate: "2025-09-01",
            },
            {
              donor: "Liam Bennett",
              email: "liam.bennett@email.com",
              amount: "$100",
              startDate: "2025-07-01",
              billingDate: "2025-08-01",
            },
            {
              donor: "Ava Harper",
              email: "ava.harper@email.com",
              amount: "$75",
              startDate: "2025-06-15",
              billingDate: "2025-07-15",
            },
          ],
          inventorySent: [
            {
              item: "1500 pads",
              beneficiary: "Sophia Adebayo",
              donor: "Sophia Carter",
            },
            {
              item: "School supplies",
              beneficiary: "Fatima Diallo",
              donor: "Liam Bennett",
            },
            {
              item: "Scholarships",
              beneficiary: "Aisha Kone",
              donor: "Ava Harper",
            },
          ],
          stories: [
            {
              title: "Empowering Girls in Rural Malawi",
              description:
                "Through our partnership with local organizations, we’ve provided educational resources and mentorship to girls in rural Malawi, helping them stay in school and achieve their full potential.",
              donor: "Sophia Carter",
              beneficiary: "Sophia Adebayo",
              inventory: "School supplies and mentorship materials",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCq5q39tZvJwV9ZFz2_Mi7hfVDqxs2nxbi072w8YOsUgRMZXJowQjxoOGKIRZnI9qk4LM9h98oMTFzNb3VRHiFeiEyfuhXe-0axaqoPY5MrtwQD8VPNMc42_iv9aAAYM-ehuM2oqKAJVkLGdRQrQTMxTftUwFWX6xADsTv-DwbakAfqKld6Gnw3nB7GOqM6LONR2ImNJZLz98_wZ7Z5sjvmuzbHDPw2cN1N0Y-OU1pfMvAV8DJP_JVtgk9i_oqx4jUDcII3L0jE_Jq9",
            },
            {
              title: "Supporting Girls’ Education in Sierra Leone",
              description:
                "Our program in Sierra Leone focuses on providing scholarships and school supplies to girls from low-income families, ensuring they have access to quality education.",
              donor: "Liam Bennett",
              beneficiary: "Fatima Diallo",
              inventory: "Scholarships and school supplies",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuByJ22ACxpHdPgDSZzyTyapLIVBg9UIbsbmMc3GSm-c0oeOZMxk2qxALQDIo7pbK5XbldQbkAgazag5_2KRh16gyrchj_tMCykro60iWFaDgZgLL2zofccGFeyupFAExLSu2bWXPhtGi9NlpLyjezweJbBRAQ5CK0ujY7KXwO_MWtWpK2PEKh-Kqh6l7rNQzPL8Aily9eGetEfsunSE65KnrUTF-ROernAZpZTBKoKYj130qIhYwjRqCr9gofDDHg8O3Op3v66uUpFo",
            },
            {
              title: "Promoting Menstrual Hygiene in Tanzania",
              description:
                "We’ve distributed over 1500 sanitary pads to girls in Tanzania, along with educational workshops on menstrual hygiene, reducing absenteeism and improving confidence.",
              donor: "Ava Harper",
              beneficiary: "Aisha Kone",
              inventory: "Sanitary pads and educational materials",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCNE5l42MXGi8mOHDpA6nbO__N7g53p7U3zZxWXAJMy72dCqaUd_UN8xOWDHV-06jqUY3XY4CcDjff21cHqGgb06yzMvqKZFI8hIaagXKvRjVSoMvvvR6i8wFKAZP4UTwFiHxs0FWNhmhuN1LfDq_wrgb9eOwxBbaSF5hWyJdHO94B-jmwq3GRRPmVJs6cOJ2NZHDrIP4wGZG9a8Zje70t04Svni_lPqFdag56NFcvEqHKduYSDwMYD6b0dVLMqT4PG1VSOHooeXEIm",
            },
          ],
        },
        {
          id: 2,
          name: "Future Leaders Initiative",
          email: "leaders@example.org",
          mission: "Providing educational resources and scholarships.",
          status: "approved",
          donors: [
            { name: "Emma Wilson", email: "emma.wilson@leaders.org" },
            { name: "Noah Patel", email: "noah.patel@leaders.org" },
            { name: "Olivia Kim", email: "olivia.kim@leaders.org" },
          ],
          beneficiaries: [
            { name: "Amara Ndu", donor: "Emma Wilson" },
            { name: "Zoe Okoye", donor: "Noah Patel" },
            { name: "Chloe Mensah", donor: "Olivia Kim" },
          ],
          oneTimeDonations: [
            {
              donor: "Emma Wilson",
              email: "emma.wilson@leaders.org",
              amount: "$200",
              date: "2025-09-01",
            },
            {
              donor: "Noah Patel",
              email: "noah.patel@leaders.org",
              amount: "$80",
              date: "2025-08-20",
            },
            {
              donor: "Olivia Kim",
              email: "olivia.kim@leaders.org",
              amount: "$120",
              date: "2025-07-15",
            },
          ],
          recurringDonations: [
            {
              donor: "Emma Wilson",
              email: "emma.wilson@leaders.org",
              amount: "$30",
              startDate: "2025-06-01",
              billingDate: "2025-09-01",
            },
            {
              donor: "Noah Patel",
              email: "noah.patel@leaders.org",
              amount: "$60",
              startDate: "2025-07-10",
              billingDate: "2025-08-10",
            },
            {
              donor: "Olivia Kim",
              email: "olivia.kim@leaders.org",
              amount: "$45",
              startDate: "2025-06-20",
              billingDate: "2025-07-20",
            },
          ],
          inventorySent: [
            {
              item: "1000 notebooks",
              beneficiary: "Amara Ndu",
              donor: "Emma Wilson",
            },
            {
              item: "Textbooks",
              beneficiary: "Zoe Okoye",
              donor: "Noah Patel",
            },
            {
              item: "Laptops",
              beneficiary: "Chloe Mensah",
              donor: "Olivia Kim",
            },
          ],
          stories: [
            {
              title: "Building Future Scientists in Nigeria",
              description:
                "Our initiative provided textbooks and lab equipment to girls in Nigeria, fostering their interest in STEM fields.",
              donor: "Emma Wilson",
              beneficiary: "Amara Ndu",
              inventory: "Textbooks and lab equipment",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCq5q39tZvJwV9ZFz2_Mi7hfVDqxs2nxbi072w8YOsUgRMZXJowQjxoOGKIRZnI9qk4LM9h98oMTFzNb3VRHiFeiEyfuhXe-0axaqoPY5MrtwQD8VPNMc42_iv9aAAYM-ehuM2oqKAJVkLGdRQrQTMxTftUwFWX6xADsTv-DwbakAfqKld6Gnw3nB7GOqM6LONR2ImNJZLz98_wZ7Z5sjvmuzbHDPw2cN1N0Y-OU1pfMvAV8DJP_JVtgk9i_oqx4jUDcII3L0jE_Jq9",
            },
            {
              title: "Empowering Coders in Ghana",
              description:
                "We supplied laptops and coding workshops to girls in Ghana, helping them develop tech skills for future careers.",
              donor: "Noah Patel",
              beneficiary: "Zoe Okoye",
              inventory: "Laptops and coding workshops",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuByJ22ACxpHdPgDSZzyTyapLIVBg9UIbsbmMc3GSm-c0oeOZMxk2qxALQDIo7pbK5XbldQbkAgazag5_2KRh16gyrchj_tMCykro60iWFaDgZgLL2zofccGFeyupFAExLSu2bWXPhtGi9NlpLyjezweJbBRAQ5CK0ujY7KXwO_MWtWpK2PEKh-Kqh6l7rNQzPL8Aily9eGetEfsunSE65KnrUTF-ROernAZpZTBKoKYj130qIhYwjRqCr9gofDDHg8O3Op3v66uUpFo",
            },
            {
              title: "Supporting Education in Kenya",
              description:
                "Our program distributed notebooks and school supplies to girls in Kenya, ensuring access to quality education.",
              donor: "Olivia Kim",
              beneficiary: "Chloe Mensah",
              inventory: "Notebooks and school supplies",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCNE5l42MXGi8mOHDpA6nbO__N7g53p7U3zZxWXAJMy72dCqaUd_UN8xOWDHV-06jqUY3XY4CcDjff21cHqGgb06yzMvqKZFI8hIaagXKvRjVSoMvvvR6i8wFKAZP4UTwFiHxs0FWNhmhuN1LfDq_wrgb9eOwxBbaSF5hWyJdHO94B-jmwq3GRRPmVJs6cOJ2NZHDrIP4wGZG9a8Zje70t04Svni_lPqFdag56NFcvEqHKduYSDwMYD6b0dVLMqT4PG1VSOHooeXEIm",
            },
          ],
        },
        {
          id: 3,
          name: "Girls’ Empowerment Network",
          email: "gen@example.org",
          mission: "Advocating for girls’ rights and access to education.",
          status: "approved",
          donors: [
            { name: "Isabella Chen", email: "isabella.chen@gen.org" },
            { name: "Ethan Mwangi", email: "ethan.mwangi@gen.org" },
            { name: "Mia Osei", email: "mia.osei@gen.org" },
          ],
          beneficiaries: [
            { name: "Nia Kamau", donor: "Isabella Chen" },
            { name: "Aminata Sow", donor: "Ethan Mwangi" },
            { name: "Lila Toure", donor: "Mia Osei" },
          ],
          oneTimeDonations: [
            {
              donor: "Isabella Chen",
              email: "isabella.chen@gen.org",
              amount: "$150",
              date: "2025-08-05",
            },
            {
              donor: "Ethan Mwangi",
              email: "ethan.mwangi@gen.org",
              amount: "$90",
              date: "2025-07-25",
            },
            {
              donor: "Mia Osei",
              email: "mia.osei@gen.org",
              amount: "$200",
              date: "2025-06-30",
            },
          ],
          recurringDonations: [
            {
              donor: "Isabella Chen",
              email: "isabella.chen@gen.org",
              amount: "$40",
              startDate: "2025-07-05",
              billingDate: "2025-08-05",
            },
            {
              donor: "Ethan Mwangi",
              email: "ethan.mwangi@gen.org",
              amount: "$70",
              startDate: "2025-06-25",
              billingDate: "2025-07-25",
            },
            {
              donor: "Mia Osei",
              email: "mia.osei@gen.org",
              amount: "$55",
              startDate: "2025-06-10",
              billingDate: "2025-07-10",
            },
          ],
          inventorySent: [
            {
              item: "2000 sanitary pads",
              beneficiary: "Nia Kamau",
              donor: "Isabella Chen",
            },
            {
              item: "Mentorship program",
              beneficiary: "Aminata Sow",
              donor: "Ethan Mwangi",
            },
            {
              item: "School uniforms",
              beneficiary: "Lila Toure",
              donor: "Mia Osei",
            },
          ],
          stories: [
            {
              title: "Advancing Hygiene in Uganda",
              description:
                "We distributed sanitary pads to girls in Uganda, supporting their health and school attendance.",
              donor: "Isabella Chen",
              beneficiary: "Nia Kamau",
              inventory: "Sanitary pads",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCq5q39tZvJwV9ZFz2_Mi7hfVDqxs2nxbi072w8YOsUgRMZXJowQjxoOGKIRZnI9qk4LM9h98oMTFzNb3VRHiFeiEyfuhXe-0axaqoPY5MrtwQD8VPNMc42_iv9aAAYM-ehuM2oqKAJVkLGdRQrQTMxTftUwFWX6xADsTv-DwbakAfqKld6Gnw3nB7GOqM6LONR2ImNJZLz98_wZ7Z5sjvmuzbHDPw2cN1N0Y-OU1pfMvAV8DJP_JVtgk9i_oqx4jUDcII3L0jE_Jq9",
            },
            {
              title: "Mentorship for Girls in Senegal",
              description:
                "Our mentorship program in Senegal empowers girls to pursue leadership roles and higher education.",
              donor: "Ethan Mwangi",
              beneficiary: "Aminata Sow",
              inventory: "Mentorship program materials",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuByJ22ACxpHdPgDSZzyTyapLIVBg9UIbsbmMc3GSm-c0oeOZMxk2qxALQDIo7pbK5XbldQbkAgazag5_2KRh16gyrchj_tMCykro60iWFaDgZgLL2zofccGFeyupFAExLSu2bWXPhtGi9NlpLyjezweJbBRAQ5CK0ujY7KXwO_MWtWpK2PEKh-Kqh6l7rNQzPL8Aily9eGetEfsunSE65KnrUTF-ROernAZpZTBKoKYj130qIhYwjRqCr9gofDDHg8O3Op3v66uUpFo",
            },
            {
              title: "Uniforms for Education in Mali",
              description:
                "We provided school uniforms to girls in Mali, ensuring they can attend school with confidence.",
              donor: "Mia Osei",
              beneficiary: "Lila Toure",
              inventory: "School uniforms",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCNE5l42MXGi8mOHDpA6nbO__N7g53p7U3zZxWXAJMy72dCqaUd_UN8xOWDHV-06jqUY3XY4CcDjff21cHqGgb06yzMvqKZFI8hIaagXKvRjVSoMvvvR6i8wFKAZP4UTwFiHxs0FWNhmhuN1LfDq_wrgb9eOwxBbaSF5hWyJdHO94B-jmwq3GRRPmVJs6cOJ2NZHDrIP4wGZG9a8Zje70t04Svni_lPqFdag56NFcvEqHKduYSDwMYD6b0dVLMqT4PG1VSOHooeXEIm",
            },
          ],
        },
      ];
      localStorage.setItem("charities", JSON.stringify(storedCharities));

      // Seed validCredentials
      const validCredentials = {
        Administrator: {
          email: "admin@example.com",
          password: "admin123",
          name: "Admin",
        },
        Donor: {
          email: "donor@example.com",
          password: "password123",
          name: "Donor",
        },
        Charity: [
          {
            email: "hope@example.org",
            password: "charity123",
            name: "Hope for Girls",
          },
          {
            email: "leaders@example.org",
            password: "charity123",
            name: "Future Leaders Initiative",
          },
          {
            email: "gen@example.org",
            password: "charity123",
            name: "Girls’ Empowerment Network",
          },
        ],
      };
      localStorage.setItem(
        "validCredentials",
        JSON.stringify(validCredentials)
      );
    }

    setCharities(storedCharities);
  }, [navigate]);

  const handleViewCharity = (charity) => {
    alert(`Viewing ${charity.name}: ${charity.mission}`);
  };

  const handleDeleteCharity = (charityId) => {
    const updatedCharities = charities.map((charity) =>
      charity.id === charityId ? { ...charity, status: "deleted" } : charity
    );
    setCharities(updatedCharities);
    localStorage.setItem("charities", JSON.stringify(updatedCharities));

    // Remove from validCredentials
    const validCredentials = JSON.parse(
      localStorage.getItem("validCredentials") || "{}"
    );
    validCredentials.Charity = validCredentials.Charity.filter(
      (c) => c.email !== charities.find((ch) => ch.id === charityId).email
    );
    localStorage.setItem("validCredentials", JSON.stringify(validCredentials));
  };

  const handleApproveCharity = (charityId) => {
    const updatedCharities = charities.map((charity) =>
      charity.id === charityId ? { ...charity, status: "approved" } : charity
    );
    setCharities(updatedCharities);
    localStorage.setItem("charities", JSON.stringify(updatedCharities));
  };

  const handleRejectCharity = (charityId) => {
    const updatedCharities = charities.map((charity) =>
      charity.id === charityId ? { ...charity, status: "rejected" } : charity
    );
    setCharities(updatedCharities);
    localStorage.setItem("charities", JSON.stringify(updatedCharities));
  };

  const handleLogOut = () => {
    localStorage.removeItem("loggedInAdmin");
    navigate("/");
  };

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const renderContent = () => {
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
