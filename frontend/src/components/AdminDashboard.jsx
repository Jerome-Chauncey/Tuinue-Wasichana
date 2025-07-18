import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard - Tuinue Wasichana</h2>
      <p>Welcome, Admin! Here you can:</p>
      <ul>
        <li>Review and approve/reject charity applications</li>
        <li>Delete existing charities</li>
        <li>View all registered charities</li>
      </ul>
      <p>
        <a href="/login">Log Out</a>
      </p>
    </div>
  );
};

export default AdminDashboard;
