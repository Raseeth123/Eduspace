import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseManagement = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [students, setStudents] = useState([]);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/faculty/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log(data)
      if (data.success) {
        setCourse(data.course);
        setStudents(data.course.students);
      }
      else console.log(data);
    };
    fetchCourse();
  }, [courseId]);

  const handleAddStudent = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5000/api/faculty/course/${courseId}/add-student`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: studentEmail }),
      }
    );
    const data = await response.json();
    if (data.success) {
      setStudents([...students, data.student]);
      setStudentEmail(""); // Reset the email input
    } else {
      alert(data.message); // Display error message
    }
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div>
      <h2>Manage Students for {course.title}</h2>
      <h3>Enrolled Students</h3>
      <ul>
        {students.map((student) => (
          <li key={student._id}>
            {student.name} ({student.email})
          </li>
        ))}
      </ul>

      <h3>Add Student to Course</h3>
      <input
        type="email"
        value={studentEmail}
        onChange={(e) => setStudentEmail(e.target.value)}
        placeholder="Enter student email"
      />
      <button onClick={handleAddStudent}>Add Student</button>
    </div>
  );
};

export default CourseManagement;
