import React, { useState } from "react";
import { toast } from "react-toastify";

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/faculty/create-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message, { position: "top-right" });
        setFormData({ title: "", description: "", department: "" });
      } else {
        toast.error(data.message, { position: "top-right" });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.", { position: "top-right" });
    }
  };

  return (
    <div>
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Department</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Course</button>
      </form>
    </div>
  );
};

export default AddCourse;
