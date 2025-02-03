import React, { useState, useRef } from "react";
import AddFaculty from "../components/AdminPanel/AddFaculty";
import Toast from "../components/Toast";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);
  const [studentFile, setStudentFile] = useState(null);
  const [batchName, setBatchName] = useState("");
  const fileInputRef = useRef(null);
  const studentFileInputRef = useRef(null);
  const [studentFormData, setStudentFormData] = useState({
    batchName:"",
    id: "",
    name: "",
    email: "",
    department: "",
  });

  const handleChange = (e) => {
    setStudentFormData({ ...studentFormData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("Selected faculty file:", e.target.files[0]);
  };

  const handleStudentFileChange = (e) => {
    setStudentFile(e.target.files[0]);
    console.log("Selected student file:", e.target.files[0]);
  };

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
      const response = await fetch("http://localhost:5000/api/admin/upload-facultyset", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload faculty list");

      const data = await response.json();
      alert(data.message);
      console.log("Faculty List Upload Response:", data);

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading faculty file:", error);
      alert("Failed to upload faculty file. Please try again.");
    }
  };

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

      setStudentFile(null);
      setBatchName("");
      if (studentFileInputRef.current) studentFileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading student file:", error);
      alert("Failed to upload student file. Please try again.");
    }
  };

  const handleStudentAddition = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/addStudent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(studentFormData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unknown error occurred.");
      }

      const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success(data.message, { position: "top-right" });
        setStudentFormData({batchName:"",id: "", name: "", email: "", department: "" });
      } else {
        toast.error(data.message, { position: "top-right" });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred: " + error.message, { position: "top-right" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-8">Admin Dashboard</h1>
        <Toast />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <AddFaculty />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Faculty Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Faculty List</h2>
            <input
              type="file"
              name="csvFile"
              accept=".csv"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-500 mb-4
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
            <button
              onClick={handleUpload}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Upload Faculty List
            </button>
          </div>

          {/* Student Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Student List</h2>
            <form onSubmit={handleStudentFileUpload}>
              <input
                type="text"
                placeholder="Enter Batch Name (e.g. IT 2022)"
                onChange={(e) => setBatchName(e.target.value)}
                value={batchName}
                required
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="file"
                name="studentCsvFile"
                accept=".csv"
                onChange={handleStudentFileChange}
                ref={studentFileInputRef}
                className="block w-full text-sm text-gray-500 mb-4
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Upload Student List
              </button>
            </form>
          </div>
        </div>

        {/* Add Individual Student Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Add Individual Student</h2>
          <form onSubmit={handleStudentAddition} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="batchName"
              placeholder="Batch Name"
              value={studentFormData.batchName}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="id"
              placeholder="Student ID"
              value={studentFormData.id}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={studentFormData.name}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={studentFormData.email}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={studentFormData.department}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="md:col-span-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Add Student
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;