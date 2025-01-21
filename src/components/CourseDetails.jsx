import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:5000/api/student/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.success) {
          setCourse(data.course);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>{course.title}</h2>
      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Department:</strong> {course.department}</p>
      <p><strong>Faculty ID:</strong> {course.faculty}</p>
    </div>
  );
};

export default CourseDetails;
