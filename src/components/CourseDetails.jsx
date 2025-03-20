import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Chat from "./Chat.jsx";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCO, setExpandedCO] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [studentId, setStudentId] = useState("");
  const jwtToken = localStorage.getItem("token");

  function decodeJwtPayload(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    const payload = parts[1];
    const base64Payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(base64Payload);
    const payloadObject = JSON.parse(decodedPayload);
    return payloadObject;
  }

  const decodedPayload = jwtToken ? decodeJwtPayload(jwtToken) : null;

  useEffect(() => {
    if (decodedPayload) {
      setStudentId(decodedPayload.id);
    }
  }, [decodedPayload]);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const courseResponse = await fetch(`http://localhost:5000/api/student/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const courseData = await courseResponse.json();

        if (!courseData.success) {
          setError(courseData.message);
          return;
        }

        setCourse(courseData.message);
        setCourseName(courseData.message.title);
        // Fix: Correctly access the assignments from courseData.message instead of courseData
        if (courseData.message.assignments && Array.isArray(courseData.message.assignments)) {
          setAssignments(courseData.message.assignments);
          console.log("Assignments loaded:", courseData.message.assignments);
        } else {
          setAssignments([]);
          console.log("No assignments found or not in expected format");
        }

        const materialsResponse = await fetch(`http://localhost:5000/api/student/course-materials/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const materialsData = await materialsResponse.json();

        if (materialsData.success) {
          setMaterials(materialsData.materials || []);
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError("Failed to load course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/student/details/${decodedPayload.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setStudentName(data.student.name);
          console.log(studentName);
        } else {
          toast.error(data.message || "Failed to fetch Student Details");
        }
      } catch (error) {
        console.error("Error fetching Student details:", error);
        toast.error("Failed to fetch Student details.", { position: "top-right" });
      }
    };

    if (courseId) fetchStudent();
  }, [courseId, decodedPayload]);

  const getMaterialsByCO = (co) => {
    if (!materials.length) return [];
    const formattedCO = co.replace(" ", "-");
    return materials.filter(material => material.CO && material.CO.toLowerCase() === formattedCO.toLowerCase());
  };

  const getAssignmentsByCO = (co) => {
    if (!assignments.length) return [];
    const formattedCO = co.replace(" ", "-");
    return assignments.filter(assignment => assignment.co && assignment.co.toLowerCase() === formattedCO.toLowerCase());
  };

  const toggleCO = (co) => {
    setExpandedCO(expandedCO === co ? null : co);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  if (!course) {
    return <div className="p-4 bg-yellow-100 text-yellow-700 rounded">Course not found</div>;
  }

  const courseOutcomes = ["CO 1", "CO 2", "CO 3", "CO 4", "CO 5"];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{course.title}</h1>
        <div className="space-y-3">
          <p className="text-gray-700"><span className="font-semibold">Description:</span> {course.description}</p>
          <p className="text-gray-700"><span className="font-semibold">Department:</span> {course.department}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 text-gray-700">Course Materials</h2>
        {materials.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No course materials available yet.</p>
        ) : (
          <div className="space-y-3">
            {courseOutcomes.map((co) => {
              const materialsList = getMaterialsByCO(co);
              if (!materialsList.length) return null;

              return (
                <div key={`materials-${co}`} className="border rounded-md overflow-hidden">
                  <div
                    className={`flex justify-between items-center p-4 cursor-pointer ${expandedCO === `materials-${co}` ? "bg-indigo-100" : "bg-gray-50"}`}
                    onClick={() => toggleCO(`materials-${co}`)}
                  >
                    <h3 className="text-md font-medium text-gray-700">{co}</h3>
                    <button className="text-indigo-600">
                      {expandedCO === `materials-${co}` ? <span className="text-xl">−</span> : <span className="text-xl">+</span>}
                    </button>
                  </div>
                  {expandedCO === `materials-${co}` && (
                    <div className="p-4 bg-white">
                      <ul className="space-y-3">
                        {materialsList.map((material, index) => (
                          <li key={index} className="p-3 bg-gray-50 rounded-md">
                            <div className="flex flex-col">
                              <h4 className="font-medium text-indigo-700">{material.title}</h4>
                              {material.description && <p className="text-sm text-gray-600 mt-1">{material.description}</p>}
                              <p className="text-xs text-gray-500 mt-1">Uploaded: {formatDate(material.createdAt || new Date())}</p>
                              <div className="mt-3">
                                <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                  Download
                                </a>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-700">Assignments</h2>
        {assignments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No assignments available yet.</p>
        ) : (
          <div className="space-y-3">
            {courseOutcomes.map((co) => {
              const assignmentsList = getAssignmentsByCO(co);
              if (!assignmentsList.length) return null;

              return (
                <div key={`assignments-${co}`} className="border rounded-md overflow-hidden">
                  <div
                    className={`flex justify-between items-center p-4 cursor-pointer ${expandedCO === `assignments-${co}` ? "bg-indigo-100" : "bg-gray-50"}`}
                    onClick={() => toggleCO(`assignments-${co}`)}
                  >
                    <h3 className="text-md font-medium text-gray-700">{co}</h3>
                    <button className="text-indigo-600">
                      {expandedCO === `assignments-${co}` ? <span className="text-xl">−</span> : <span className="text-xl">+</span>}
                    </button>
                  </div>
                  {expandedCO === `assignments-${co}` && (
                    <div className="p-4 bg-white">
                      <ul className="space-y-3">
                        {assignmentsList.map((assignment, index) => (
                          <li key={index} className="p-3 bg-gray-50 rounded-md">
                            <div className="flex flex-col">
                              <h4 className="font-medium text-indigo-700">{assignment.title}</h4>
                              {assignment.description && <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>}
                              <p className="text-xs text-gray-500 mt-1">Due: {formatDate(assignment.dueDate || new Date())}</p>
                              {assignment.fileUrl && (
                                <div className="mt-3">
                                  <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download
                                  </a>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Chat userId={studentId} courseName={courseName} username={studentName} room={courseId} />
    </div>
  );
};

export default CourseDetails;
