import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // To show a loading spinner while fetching data
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/student/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.success) {
          setCourses(data.courses);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>My Enrolled Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found. You are not enrolled in any courses yet.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course._id}>
              <Link to={`/student/course/${course._id}`}>{course.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;
