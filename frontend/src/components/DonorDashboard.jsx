import React from "react";

const DonorDashboard = () => {
  return (
    <div>
      <h2>Donor Dashboard - Tuinue Wasichana</h2>
      <p>Welcome, Donor! Here you can:</p>
      <ul>
        <li>Donate to a charity</li>
        <li>Set up automated repeat donations</li>
        <li>Choose to donate anonymously</li>
        <li>View stories about beneficiaries</li>
      </ul>
      <p>
        <a href="/login">Log Out</a>
      </p>
    </div>
  );
};

export default DonorDashboard;
