import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Toast from "./components/Toast";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import FacultyDashboard from "./pages/FacultyDashboard";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Toast/>
            <Register />
          </>} />
        <Route path="/login" element={
          <>
            <Toast/>
            <Login/>
          </>} />
        <Route path="/forgot-password" element={
          <>
            <Toast/>
            <ForgotPassword />
          </>
          } />
        <Route path="/reset-password/:token" element={
          <>
            <Toast/>
            <ResetPassword />
          </>
        } />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute
              element={
              <>
               <Toast/>
               <AdminDashboard />
              </>
              }
              allowedRoles={["admin"]} 
            />
          }
        />
        <Route
          path="/dashboard/faculty"
          element={
            <ProtectedRoute
              element={<FacultyDashboard />}
              allowedRoles={["faculty"]} 
            />
          }
        />
       {/* <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute
              element={<StudentDashboard />}
              allowedRoles={["student"]} 
            />
          }
        /> */}
      </Routes>
    </Router>
  );
};

export default App;
