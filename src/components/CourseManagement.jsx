import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BatchSelector } from "./BatchSelector";
const CourseManagement = () => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/faculty/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setCourse(data.course || {});
          setStudents(data.course.students || []);
        } 
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [courseId,students]);

  const handleAddStudent = async () => {
    const emailArray = studentEmail.split(",").map((email) => email.trim());
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/faculty/course/${courseId}/add-student`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailArray }),
        }
      );
      const data = await response.json();
      emailArray.forEach((email) => {
        const successEntry = data.addedStudents.find((entry) => entry.email === email);
        const errorEntry = data.errors.find((entry) => entry.email === email);

        if (successEntry) {
          toast.success(successEntry.message, { position: "top-right" });
          setStudents((prevStudents) => [...prevStudents, successEntry.student]);
        } else if (errorEntry) {
          toast.error(`Error with ${email}: ${errorEntry.message}`, { position: "top-right" });
        }
      });

      setStudentEmail(""); 
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student(s).", { position: "top-right" });
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
            {student.name || "Unnamed Student"} ({student.email})
          </li>
        ))}
      </ul>

      <h3>Add Student to Course</h3>
      <input
        type="email"
        value={studentEmail}
        onChange={(e) => setStudentEmail(e.target.value)}
        placeholder="Enter students' email (comma-separated)"
      />
      <button onClick={handleAddStudent}>Add Student</button>
      <BatchSelector onSelectBatch={setSelectedBatch} courseId={courseId} />
      <p>Selected Batch: {selectedBatch}</p>
    </div>
  );
};

export default CourseManagement;
