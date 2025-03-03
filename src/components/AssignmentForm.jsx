import React, { useState } from "react";
import { toast } from "react-toastify";
import DisplayAssignments from "./DisplayAssignments"; // Ensure the path is correct

const AssignmentForm = ({ courseId }) => {
  const [formData, setFormData] = useState({
    courseId,
    co: "",
    title: "",
    description: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseId) {
      toast.error("Course ID is missing", { position: "top-right" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token not found", { position: "top-right" });
        return;
      }

      const response = await fetch("http://localhost:5000/api/faculty/add-assignments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message, { position: "top-right" });
        setFormData({
          courseId,
          co: "",
          title: "",
          description: "",
          dueDate: "",
        });
      } else {
        toast.error(data.message, { position: "top-right" });
        console.error("Server error details:", data.details || data.error);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred during upload. Please try again.", { position: "top-right" });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Assignments</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="co" className="block text-sm font-medium text-gray-700">
            Course Outcome (CO)
          </label>
          <input
            id="co"
            type="text"
            name="co"
            placeholder="CO (e.g., CO-1)"
            value={formData.co}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Assignment Title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Assignment Description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Assignments
        </button>
      </form>
      <br/>
      <DisplayAssignments courseId={courseId}/>
    </div>
  );
};

export default AssignmentForm;
