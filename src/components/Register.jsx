import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
  const [formData, setFormData] = useState({ name:"", email: "", password: "", role: "student" });
  const [message, setMessage] = useState("");
  const navigate=useNavigate();
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      toast.success("User Registered Successfully!",{position:"top-right"});
      navigate("/login",{replace:true})
    } catch (error) {
      toast.error(error.message,{position:"top-right"});
    }
  };

  return (
    <section className="w-full h-screen flex flex-wrap">
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 relative">
        <img src="https://i.pinimg.com/736x/99/00/e2/9900e2954f73381e5496267b200d3ec3.jpg" className="h-screen w-full object-cover" alt="LMS visual" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
        <div className="absolute bottom-6 left-6 text-left text-white">
          <h1 className="text-3xl font-bold drop-shadow-lg">Welcome to EduSphere LMS</h1>
          <p className="mt-2 text-lg font-medium">"Empowering Learning, One Click at a Time"</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join our community of learners today</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 bg-gray-50" type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 bg-gray-50" type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 bg-gray-50" type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 bg-gray-50">
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="w-full py-4 mt-6 bg-green-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]">Create Account</button>
          </form>
          {message && (
            <div className={`mt-6 p-4 rounded-lg ${message.includes("Successfully") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              {message}
            </div>
          )}
          <p className="mt-8 text-center text-gray-600">Already have an account? <Link to="/Login" className="text-orange-500 hover:text-orange-600 font-medium">Sign in</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Register;
