import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import "../css/CharityDashboard.css";

const CharityDashboard = () => {
  const navigate = useNavigate();
  const [charity, setCharity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Check if user is logged in as a charity
    if (!token || role !== "charity") {
      navigate("/login");
      return;
    }

    // Fetch charity data from backend
    const fetchCharityData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5003/api/charity-dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          if (response.status === 403 || response.status === 404) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch charity dashboard");
        }
        const data = await response.json();
        setCharity(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCharityData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleCreateStory = () => {
    navigate("/create-story");
  };

  if (error) {
    return (
      <div
        className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
        style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
      >
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaeff1] px-10 py-3">
            <div className="flex items-center gap-4 text-[#101618]">
              <h2 className="text-[#101618] text-lg font-bold leading-tight tracking-[-0.015em]">
                Tuinue Wasichana
              </h2>
            </div>
          </header>
          <div className="px-6 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <p className="text-red-500">Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!charity) return null;

  // Calculate donation metrics
  const oneTimeDonations = charity.donors
    .filter((d) => d.donationType === "one-time")
    .map((d, index) => ({
      donor: d.name,
      email: d.email,
      amount: d.amount || "$0", // Fallback if amount not provided
      date: d.date || "N/A", // Fallback if date not provided
    }));
  const recurringDonations = charity.donors
    .filter((d) => d.donationType === "recurring")
    .map((d, index) => ({
      donor: d.name,
      email: d.email,
      amount: d.amount || "$0", // Fallback if amount not provided
      startDate: d.start_date || "N/A",
      billingDate: d.billing_date || "N/A",
    }));
  const totalDonations = oneTimeDonations.reduce(
    (sum, d) => sum + parseFloat(d.amount.replace("$", "")),
    0
  );
  const recurringDonationsTotal = recurringDonations.reduce(
    (sum, d) => sum + parseFloat(d.amount.replace("$", "")),
    0
  );
  const uniqueDonors = new Set(charity.donors.map((d) => d.email || d.name))
    .size;

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaeff1] px-10 py-3">
          <div className="flex items-center gap-4 text-[#101618]">
            <h2 className="text-[#101618] text-lg font-bold leading-tight tracking-[-0.015em]">
              Tuinue Wasichana
            </h2>
          </div>
        </header>
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-gray-50 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <h1 className="text-[#101618] text-base font-medium leading-normal">
                    {charity.name}
                  </h1>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/charity-dashboard"
                    className="flex items-center gap-3 px-3 py-2 rounded-full bg-[#eaeff1]"
                  >
                    <div
                      className="text-[#101618]"
                      data-icon="House"
                      data-size="24px"
                      data-weight="fill"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
                      </svg>
                    </div>
                    <p className="text-[#101618] text-sm font-medium leading-normal">
                      Dashboard
                    </p>
                  </Link>
                  <Link
                    to="/charity-dashboard/beneficiaries"
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <div
                      className="text-[#101618]"
                      data-icon="Users"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M117.25,157.92a60,60,0,1,0-66.50,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" />
                      </svg>
                    </div>
                    <p className="text-[#101618] text-sm font-medium leading-normal">
                      Beneficiaries
                    </p>
                  </Link>
                  <Link
                    to="/charity-dashboard/inventory-sent"
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <div
                      className="text-[#101618]"
                      data-icon="Package"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.90-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" />
                      </svg>
                    </div>
                    <p className="text-[#101618] text-sm font-medium leading-normal">
                      Inventory Sent
                    </p>
                  </Link>
                  <Link
                    to="/charity-dashboard/stories"
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <div
                      className="text-[#101618]"
                      data-icon="Bookmark"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,16V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48ZM132.23,177.22a8,8,0,0,0-8.48,0L72,209.57V180.43l56-35,56,35v29.14Z" />
                      </svg>
                    </div>
                    <p className="text-[#101618] text-sm font-medium leading-normal">
                      Beneficiary Stories
                    </p>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleCreateStory}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3f9fbf] text-[#101618] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Create Story</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2"
                >
                  <div
                    className="text-[#101618]"
                    data-icon="ArrowLeft"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
                    </svg>
                  </div>
                  <p className="text-[#101618] text-sm font-medium leading-normal">
                    Log Out
                  </p>
                </button>
              </div>
            </div>
          </div>
          <Routes>
            <Route
              path="/"
              element={
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                  <div className="flex flex-wrap justify-between gap-3 p-4">
                    <p className="text-[#101618] tracking-tight text-[32px] font-bold leading-tight min-w-72">
                      Dashboard
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 p-4">
                    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#eaeff1]">
                      <p className="text-[#101618] text-base font-medium leading-normal">
                        Total Donations
                      </p>
                      <p className="text-[#101618] tracking-tight text-2xl font-bold leading-tight">
                        ${totalDonations.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#eaeff1]">
                      <p className="text-[#101618] text-base font-medium leading-normal">
                        Recurring Donations (monthly)
                      </p>
                      <p className="text-[#101618] tracking-tight text-2xl font-bold leading-tight">
                        ${recurringDonationsTotal.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#eaeff1]">
                      <p className="text-[#101618] text-base font-medium leading-normal">
                        Donors
                      </p>
                      <p className="text-[#101618] tracking-tight text-2xl font-bold leading-tight">
                        {uniqueDonors}
                      </p>
                    </div>
                  </div>
                  <h2 className="text-[#101618] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                    One-Time Donations
                  </h2>
                  <div className="px-4 py-3 @container">
                    <div className="flex overflow-hidden rounded-xl border border-[#d4dfe2] bg-gray-50">
                      <table className="flex-1">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="table-Dashboard-One-Time-Donations-column-120 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Donor
                            </th>
                            <th className="table-Dashboard-One-Time-Donations-column-240 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Email
                            </th>
                            <th className="table-Dashboard-One-Time-Donations-column-360 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Amount
                            </th>
                            <th className="table-Dashboard-One-Time-Donations-column-480 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {oneTimeDonations.map((donation, index) => (
                            <tr
                              key={index}
                              className="border-t border-t-[#d4dfe2]"
                            >
                              <td className="table-Dashboard-One-Time-Donations-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101618] text-sm font-normal leading-normal">
                                {donation.donor}
                              </td>
                              <td className="table-Dashboard-One-Time-Donations-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.email || ""}
                              </td>
                              <td className="table-Dashboard-One-Time-Donations-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.amount}
                              </td>
                              <td className="table-Dashboard-One-Time-Donations-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <h2 className="text-[#101618] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                    Recurring Donations
                  </h2>
                  <div className="px-4 py-3 @container">
                    <div className="flex overflow-hidden rounded-xl border border-[#d4dfe2] bg-gray-50">
                      <table className="flex-1">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="table-Dashboard-Recurring-Donations-column-120 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Donor
                            </th>
                            <th className="table-Dashboard-Recurring-Donations-column-240 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Email
                            </th>
                            <th className="table-Dashboard-Recurring-Donations-column-360 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Amount (Monthly)
                            </th>
                            <th className="table-Dashboard-Recurring-Donations-column-480 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Start Date
                            </th>
                            <th className="table-Dashboard-Recurring-Donations-column-600 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Billing Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {recurringDonations.map((donation, index) => (
                            <tr
                              key={index}
                              className="border-t border-t-[#d4dfe2]"
                            >
                              <td className="table-Dashboard-Recurring-Donations-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101618] text-sm font-normal leading-normal">
                                {donation.donor}
                              </td>
                              <td className="table-Dashboard-Recurring-Donations-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.email || ""}
                              </td>
                              <td className="table-Dashboard-Recurring-Donations-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.amount}
                              </td>
                              <td className="table-Dashboard-Recurring-Donations-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.startDate}
                              </td>
                              <td className="table-Dashboard-Recurring-Donations-column-600 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.billingDate}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/beneficiaries"
              element={
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                  <div className="flex flex-wrap justify-between gap-3 p-4">
                    <p className="text-[#101618] tracking-tight text-[32px] font-bold leading-tight min-w-72">
                      Beneficiaries
                    </p>
                  </div>
                  <div className="px-4 py-3 @container">
                    <div className="flex overflow-hidden rounded-xl border border-[#d4dfe2] bg-gray-50">
                      <table className="flex-1">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="table-Beneficiaries-column-120 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Beneficiary
                            </th>
                            <th className="table-Beneficiaries-column-240 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Donor
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {charity.stories.map((story, index) => (
                            <tr
                              key={index}
                              className="border-t border-t-[#d4dfe2]"
                            >
                              <td className="table-Beneficiaries-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101618] text-sm font-normal leading-normal">
                                {story.beneficiary}
                              </td>
                              <td className="table-Beneficiaries-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {story.donor}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/inventory-sent"
              element={
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                  <div className="flex flex-wrap justify-between gap-3 p-4">
                    <p className="text-[#101618] tracking-tight text-[32px] font-bold leading-tight min-w-72">
                      Inventory Sent
                    </p>
                  </div>
                  <div className="px-4 py-3 @container">
                    <div className="flex overflow-hidden rounded-xl border border-[#d4dfe2] bg-gray-50">
                      <table className="flex-1">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="table-Inventory-Sent-column-120 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Item
                            </th>
                            <th className="table-Inventory-Sent-column-240 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Beneficiary
                            </th>
                            <th className="table-Inventory-Sent-column-360 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Donor
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {charity.stories.map((story, index) => (
                            <tr
                              key={index}
                              className="border-t border-t-[#d4dfe2]"
                            >
                              <td className="table-Inventory-Sent-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101618] text-sm font-normal leading-normal">
                                {story.inventory}
                              </td>
                              <td className="table-Inventory-Sent-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {story.beneficiary}
                              </td>
                              <td className="table-Inventory-Sent-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {story.donor}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/stories"
              element={
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                  <div className="flex flex-wrap justify-between gap-3 p-4">
                    <div className="flex min-w-72 flex-col gap-3">
                      <p className="text-[#101618] tracking-tight text-[32px] font-bold leading-tight">
                        Beneficiary Stories
                      </p>
                      <p className="text-[#5c7e8a] text-sm font-normal leading-normal">
                        Explore the impact of your contributions through the
                        stories of the girls and communities you support.
                      </p>
                    </div>
                  </div>
                  {charity.stories.map((story, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-stretch justify-between gap-4 rounded-xl">
                        <div className="flex flex-col gap-1 flex-[2_2_0px]">
                          <p className="text-[#101618] text-base font-bold leading-tight">
                            {story.title}
                          </p>
                          <p className="text-[#5c7e8a] text-sm font-normal leading-normal">
                            {story.description}
                          </p>
                        </div>
                        <div
                          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
                          style={{
                            backgroundImage: `url("${
                              story.image || "https://via.placeholder.com/300"
                            }")`,
                          }}
                        ></div>
                      </div>
                      <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d4dfe2] py-5">
                          <p className="text-[#5c7e8a] text-sm font-normal leading-normal">
                            Donor
                          </p>
                          <p className="text-[#101618] text-sm font-normal leading-normal">
                            {story.donor}
                          </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d4dfe2] py-5">
                          <p className="text-[#5c7e8a] text-sm font-normal leading-normal">
                            Beneficiary
                          </p>
                          <p className="text-[#101618] text-sm font-normal leading-normal">
                            {story.beneficiary}
                          </p>
                        </div>
                        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d4dfe2] py-5">
                          <p className="text-[#5c7e8a] text-sm font-normal leading-normal">
                            Inventory Sent
                          </p>
                          <p className="text-[#101618] text-sm font-normal leading-normal">
                            {story.inventory}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CharityDashboard;
