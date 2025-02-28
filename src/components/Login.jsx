import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
      localStorage.setItem("sessionStart", Date.now()); 
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
    <section className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      </div>
      
      {/* Login card */}
      <div className="relative w-full max-w-md p-8 mx-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome Back!</h2>
          <p className="text-blue-100 text-sm">Log in to continue your learning journey</p>
        </div>
        
        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-blue-100">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input 
                className="w-full p-3 pl-10 bg-white bg-opacity-10 border border-blue-300 border-opacity-20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-blue-200 placeholder-opacity-70 text-white"
                type="email" 
                name="email" 
                placeholder="student@example.com" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-blue-100">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                className="w-full p-3 pl-10 bg-white bg-opacity-10 border border-blue-300 border-opacity-20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-blue-200 placeholder-opacity-70 text-white" 
                type="password" 
                name="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                className="h-4 w-4 text-blue-500 rounded border-blue-300 bg-opacity-20 focus:ring-blue-400"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-100">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-blue-200 hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-500 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
          >
            Sign in
          </button>
        </form>
        
        {message && (
          <div className={`mt-6 p-4 rounded-lg ${message.includes("Successfully") ? "bg-green-100 bg-opacity-20 text-green-100" : "bg-red-100 bg-opacity-20 text-red-100"}`}>
            {message}
          </div>
        )}
        
        <div className="mt-6 text-center text-blue-200">
          <p>Don't have an account? <Link to="/" className="text-white font-medium hover:underline">Sign up</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Login;