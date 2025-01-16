import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await response.json();
      if (data.success){
        toast.success(data.message);
        navigate("/login",{replace:true});
      }
      else toast.error(data.message);
    } catch {
      toast.error("Error resetting password.");
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
            <p className="text-gray-600">Enter your new password below</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 bg-gray-50"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-4 mt-6 bg-green-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;