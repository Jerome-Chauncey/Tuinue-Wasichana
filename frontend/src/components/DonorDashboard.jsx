import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import "../css/DonorDashboard.css";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchDonorData = async () => {
    const token = localStorage.getItem("token"); // Get token from storage
    
    try {
      const response = await fetch("http://localhost:5000/api/donor-dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch donor data");
      }

      const data = await response.json();
      setDonor(data);
    } catch (err) {
      setError(err.message);
    }
  };

  fetchDonorData();
}, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleMakeDonation = () => {
    navigate("/donate");
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

  if (!donor) return null;

  // Calculate donation metrics
  const oneTimeDonations = donor.donations
    .filter((d) => d.donationType === "one-time")
    .map((d) => ({
      charity: d.charity,
      amount: d.amount,
      date: d.date,
    }));
  const recurringDonations = donor.donations
    .filter((d) => d.donationType === "recurring")
    .map((d) => ({
      charity: d.charity,
      amount: d.amount,
      startDate: d.start_date,
      billingDate: d.billing_date,
    }));
  const totalDonations = oneTimeDonations.reduce(
    (sum, d) => sum + parseFloat(d.amount.replace("$", "")),
    0
  );
  const recurringDonationsTotal = recurringDonations.reduce(
    (sum, d) => sum + parseFloat(d.amount.replace("$", "")),
    0
  );
  const uniqueCharities = new Set(donor.charities.map((c) => c.name)).size;

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
                    {donor.name}
                  </h1>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/donor-dashboard"
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
                    to="/donor-dashboard/donations"
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <div
                      className="text-[#101618]"
                      data-icon="DollarSign"
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
                        <path d="M128,24a104,104,0,0,0-104,104,103.61,103.61,0,0,0,80,101.12V232a8,8,0,0,0,16,0V229.12A103.61,103.61,0,0,0,232,128,104,104,0,0,0,128,24Zm0,192a88,88,0,0,1-88-88,88,88,0,0,1,176,0A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V152H96a8,8,0,0,1,0-16h24V120a8,8,0,0,1,16,0v16h24A8,8,0,0,1,168,148ZM96,104a8,8,0,0,1,8-8h16V80a8,8,0,0,1,16,0V96h16a8,8,0,0,1,0,16H104A8,8,0,0,1,96,104Z" />
                      </svg>
                    </div>
                    <p className="text-[#101618] text-sm font-medium leading-normal">
                      Donations
                    </p>
                  </Link>
                  <Link
                    to="/donor-dashboard/charities"
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
                      Charities
                    </p>
                  </Link>
                  <Link
                    to="/donor-dashboard/stories"
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
                      Stories
                    </p>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleMakeDonation}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3f9fbf] text-[#101618] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Make a Donation</span>
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
                        Recurring Donations (Monthly)
                      </p>
                      <p className="text-[#101618] tracking-tight text-2xl font-bold leading-tight">
                        ${recurringDonationsTotal.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#eaeff1]">
                      <p className="text-[#101618] text-base font-medium leading-normal">
                        Supported Charities
                      </p>
                      <p className="text-[#101618] tracking-tight text-2xl font-bold leading-tight">
                        {uniqueCharities}
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
                            <th className="table-Donor-One-Time-Donations-column-120 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Charity
                            </th>
                            <th className="table-Donor-One-Time-Donations-column-360 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Amount
                            </th>
                            <th className="table-Donor-One-Time-Donations-column-480 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
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
                              <td className="table-Donor-One-Time-Donations-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101618] text-sm font-normal leading-normal">
                                {donation.charity}
                              </td>
                              <td className="table-Donor-One-Time-Donations-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.amount}
                              </td>
                              <td className="table-Donor-One-Time-Donations-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
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
                            <th className="table-Donor-Recurring-Donations-column-120 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Charity
                            </th>
                            <th className="table-Donor-Recurring-Donations-column-360 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Amount (Monthly)
                            </th>
                            <th className="table-Donor-Recurring-Donations-column-480 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Start Date
                            </th>
                            <th className="table-Donor-Recurring-Donations-column-600 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
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
                              <td className="table-Donor-Recurring-Donations-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101618] text-sm font-normal leading-normal">
                                {donation.charity}
                              </td>
                              <td className="table-Donor-Recurring-Donations-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.amount}
                              </td>
                              <td className="table-Donor-Recurring-Donations-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.startDate}
                              </td>
                              <td className="table-Donor-Recurring-Donations-column-600 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
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
              path="/donations"
              element={
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                  <div className="flex flex-wrap justify-between gap-3 p-4">
                    <p className="text-[#101618] tracking-tight text-[32px] font-bold leading-tight min-w-72">
                      Donations
                    </p>
                  </div>
                  <h2 className="text-[#101618] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                    One-Time Donations
                  </h2>
                  <div className="px-4 py-3 @container">
                    <div className="flex overflow-hidden rounded-xl border border-[#d4dfe2] bg-gray-50">
                      <table className="flex-1">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="table-Donor-One-Time-Donations-column-120 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Charity
                            </th>
                            <th className="table-Donor-One-Time-Donations-column-360 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Amount
                            </th>
                            <th className="table-Donor-One-Time-Donations-column-480 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
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
                              <td className="table-Donor-One-Time-Donations-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101618] text-sm font-normal leading-normal">
                                {donation.charity}
                              </td>
                              <td className="table-Donor-One-Time-Donations-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.amount}
                              </td>
                              <td className="table-Donor-One-Time-Donations-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
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
                            <th className="table-Donor-Recurring-Donations-column-120 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Charity
                            </th>
                            <th className="table-Donor-Recurring-Donations-column-360 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Amount (Monthly)
                            </th>
                            <th className="table-Donor-Recurring-Donations-column-480 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Start Date
                            </th>
                            <th className="table-Donor-Recurring-Donations-column-600 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
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
                              <td className="table-Donor-Recurring-Donations-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101618] text-sm font-normal leading-normal">
                                {donation.charity}
                              </td>
                              <td className="table-Donor-Recurring-Donations-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.amount}
                              </td>
                              <td className="table-Donor-Recurring-Donations-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {donation.startDate}
                              </td>
                              <td className="table-Donor-Recurring-Donations-column-600 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
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
              path="/charities"
              element={
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                  <div className="flex flex-wrap justify-between gap-3 p-4">
                    <p className="text-[#101618] tracking-tight text-[32px] font-bold leading-tight min-w-72">
                      Supported Charities
                    </p>
                  </div>
                  <div className="px-4 py-3 @container">
                    <div className="flex overflow-hidden rounded-xl border border-[#d4dfe2] bg-gray-50">
                      <table className="flex-1">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="table-Donor-Charities-column-120 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Charity Name
                            </th>
                            <th className="table-Donor-Charities-column-240 px-4 py-3 text-left text-[#101618] w-[400px] text-sm font-medium leading-normal">
                              Mission
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {donor.charities.map((charity, index) => (
                            <tr
                              key={index}
                              className="border-t border-t-[#d4dfe2]"
                            >
                              <td className="table-Donor-Charities-column-120 h-[72px] px-4 py-2 w-[400px] text-[#101618] text-sm font-normal leading-normal">
                                {charity.name}
                              </td>
                              <td className="table-Donor-Charities-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c7e8a] text-sm font-normal leading-normal">
                                {charity.mission}
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
                        Impact Stories
                      </p>
                      <p className="text-[#5c7e8a] text-sm font-normal leading-normal">
                        See the impact of your donations through these stories.
                      </p>
                    </div>
                  </div>
                  {donor.stories.map((story, index) => (
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
                            Charity
                          </p>
                          <p className="text-[#101618] text-sm font-normal leading-normal">
                            {story.charity}
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

export default DonorDashboard;
