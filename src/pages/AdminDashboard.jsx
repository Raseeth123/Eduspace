import React, { useState, useRef } from "react";
import AddFaculty from "../components/AdminPanel/AddFaculty";
import Toast from "../components/Toast";

const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [studentFile, setStudentFile] = useState(null);
  const [batchName, setBatchName] = useState("");

  const fileInputRef = useRef(null);
  const studentFileInputRef = useRef(null);

  // Handle Faculty File Change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("Selected faculty file:", e.target.files[0]);
  };

  // Handle Student File Change
  const handleStudentFileChange = (e) => {
    setStudentFile(e.target.files[0]);
    console.log("Selected student file:", e.target.files[0]);
  };

  // Handle Faculty Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a faculty file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);
    formData.append("batchName", "IT 2nd Year");

    try {
      const response = await fetch("http://localhost:5000/api/admin/upload-batch", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload faculty list");

      const data = await response.json();
      alert(data.message);
      console.log("Faculty List Upload Response:", data);

      // Reset File Input
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading faculty file:", error);
      alert("Failed to upload faculty file. Please try again.");
    }
  };

  // Handle Student Upload
  const handleStudentFileUpload = async (e) => {
    e.preventDefault();
    if (!studentFile || !batchName.trim()) {
      alert("Please select a student file and enter batch name.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", studentFile);
    formData.append("batchName", batchName);

    try {
      const response = await fetch("http://localhost:5000/api/admin/upload-studentbatch", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload student list");

      const data = await response.json();
      alert(data.message);
      console.log("Student List Upload Response:", data);

      // Reset File Inputs
      setStudentFile(null);
      setBatchName("");
      if (studentFileInputRef.current) studentFileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading student file:", error);
      alert("Failed to upload student file. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#4CAF50" }}>Admin Dashboard</h1>
      <Toast />
      <div style={{ marginTop: "20px" }}>
        <AddFaculty />
      </div>

      {/* Faculty File Upload */}
      <h2>Upload Faculty List</h2>
      <input
        type="file"
        name="csvFile"
        accept=".csv"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ marginBottom: "10px" }}
      />
      <button
        onClick={handleUpload}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upload Faculty List
      </button>

      <br />

      {/* Student File Upload */}
      <h2>Upload Student List</h2>
      <form onSubmit={handleStudentFileUpload}>
        <input
          type="text"
          placeholder="Enter Batch Name (e.g. IT 2022)"
          onChange={(e) => setBatchName(e.target.value)}
          value={batchName}
          required
          style={{
            padding: "8px",
            marginBottom: "10px",
            width: "100%",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="file"
          name="studentCsvFile"
          accept=".csv"
          onChange={handleStudentFileChange}
          ref={studentFileInputRef}
          style={{ marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Upload Student List
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
