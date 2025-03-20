import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BatchSelector } from "./BatchSelector";
import AddCourseMaterial from "./AddCourseMaterial";
import AssignmentForm from "./AssignmentForm";
import Chat from "./Chat.jsx";

const CourseManagement = () => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [students, setStudents] = useState([]);
  const [facultyId, setFacultyId] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [courseName, setCourseName] = useState("");

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
          setFacultyId(data.course.faculty);
          setStudents(data.course.students || []);
          setCourseName(data.course.title);
        } else {
          toast.error(data.message || "Failed to fetch course details.", { position: "top-right" });
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to fetch course details.", { position: "top-right" });
      }
    };

    fetchCourse();
  }, [courseId]);

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

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching faculty details for ID:", facultyId);
        const response = await fetch(`http://localhost:5000/api/faculty/details/${facultyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setFacultyName(data.faculty.name);
        } else {
          toast.error(data.message || "Failed to fetch faculty details.", { position: "top-right" });
        }
      } catch (error) {
        console.error("Error fetching faculty details:", error);
        toast.error("Failed to fetch faculty details.", { position: "top-right" });
      }
    };

    if (facultyId) {
      fetchFaculty();
    }
  }, [facultyId]);

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
      <br /><br />
      <AddCourseMaterial courseId={courseId} />
      <br />
      <AssignmentForm courseId={courseId} />
      <br />
      <Chat userId={facultyId} courseName={courseName} username={facultyName} room={courseId} />
    </div>
  );
};

export default CourseManagement;
