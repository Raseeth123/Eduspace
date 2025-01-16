import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem("token", data.message);
      const user = JSON.parse(atob(data.message.split(".")[1]));
      if (user.role === "admin") {
        navigate("/dashboard/admin");
      } else if (user.role === "faculty") {
        navigate("/dashboard/faculty");
      } else {
        navigate("/dashboard/student");
      }
    } else {
       toast.error(data.message,{position:"top-right"});
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
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Login to access your account</h2>
              <p className="text-gray-600">Join our community of learners today</p>
            </div>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 bg-gray-50" type="email" name="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 bg-gray-50" type="password" name="password" placeholder="Create a password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                <div className="flex justify-end mt-5">
                  <Link to="/forgot-password" className="text-base mt-5">
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <button type="submit" className="w-full py-4 mt-6 bg-green-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]">Login</button>
            </form>
            {message && (
              <div className={`mt-6 p-4 rounded-lg ${message.includes("Successfully") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                {message}
              </div>
            )}
            <p className="mt-8 text-center text-gray-600">Don't have an account? <Link to="/" className="text-orange-500 hover:text-orange-600 font-medium">Register</Link></p>
          </div>
        </div>
      </section>
    );
};

export default Login;