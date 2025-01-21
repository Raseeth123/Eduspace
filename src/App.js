import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Toast from "./components/Toast";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CourseManagement from "./components/CourseManagement";
import CourseDetails from "./components/CourseDetails";
// import AddStudent from "./components/AddStudent";
// import CreateCourse from "./components/CreateCourse";
import AddCourse from "./components/AddCourse";
const App = () => {
  useEffect(() => {
    const sessionTimeout = setTimeout(() => {
      localStorage.removeItem("token"); 
      alert("Session expired. You have been logged out.");
      window.location.href = "/login"; 
    }, 60*60*1000); 

    return () => clearTimeout(sessionTimeout); 
  }, []);
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
         <Route
          path="/student/course/:courseId"
          element={
            <ProtectedRoute
              element={
              <>
               <Toast/>
               <CourseDetails/>
              </>
              }
              allowedRoles={["student"]} 
            />
          }
        />
         <Route
          path="/dashboard/create-course"
          element={
            <ProtectedRoute
              element={
              <>
                <Toast/>
                <AddCourse />
              </>
               }
              allowedRoles={["faculty"]} 
            />
          }
        /> 
        <Route path="/faculty/course/:courseId" element={
           <ProtectedRoute
           element={
           <>
             <Toast/>
             <CourseManagement/>
           </>
            }
           allowedRoles={["faculty"]} 
         />
        } />
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute
              element={<StudentDashboard />}
              allowedRoles={["student"]} 
            />
          }
        /> 
      </Routes>
    </Router>
  );
};

export default App;
