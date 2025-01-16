import React from "react";
import AddFaculty from "../components/AdminPanel/AddFaculty";
import Toast from "../components/Toast";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#4CAF50" }}>Admin Dashboard</h1>
      <Toast />
      <div style={{ marginTop: "20px" }}>
        <AddFaculty />
      </div>
    </div>
  );
};

export default AdminDashboard;
