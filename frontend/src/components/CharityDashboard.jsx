import React from "react";

const CharityDashboard = () => {
  return (
    <div>
      <h2>Charity Dashboard - Tuinue Wasichana</h2>
      <p>Welcome, Charity! Here you can:</p>
      <ul>
        <li>View non-anonymous donors and their donations</li>
        <li>View amounts donated by anonymous donors</li>
        <li>View total amount donated to your charity</li>
        <li>Create and post stories of beneficiaries</li>
        <li>Maintain a list of beneficiaries and inventory</li>
      </ul>
      <p>
        <a href="/login">Log Out</a>
      </p>
    </div>
  );
};

export default CharityDashboard;
