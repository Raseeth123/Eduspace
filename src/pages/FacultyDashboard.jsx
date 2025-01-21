import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FacultyDashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/faculty/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <Link to="/dashboard/create-course">Add Course</Link>
      <h2>My Courses</h2>
      <ul>
        {courses.map((course) => (
          <Link to={`/faculty/course/${course._id}`} key={course._id}>
            <li>
              {course.title} - {course.department}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default FacultyDashboard;
