import React, { useState } from "react";
import { toast } from "react-toastify";

const AddFaculty = () => {
  const token=localStorage.getItem("token")
  console.log(token);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/addFaculty",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formData),
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
        setFormData({ name: "", email: "", password: "", department: "" });
      } else {
        toast.error(data.message, { position: "top-right" });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred: " + error.message, { position: "top-right" });
    }
  };

  return (
    <div>
      <h2>Add Faculty</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
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
        <button type="submit">Add Faculty</button>
      </form>
    </div>
  );
};

export default AddFaculty;
