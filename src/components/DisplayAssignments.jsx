import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const DisplayAssignments = ({ courseId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCO, setExpandedCO] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const courseOutcomes = ["CO-1", "CO-2", "CO-3", "CO-4", "CO-5"];

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token not found", { position: "top-right" });
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/faculty/course-assignments/${courseId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setAssignments(data.assignments || []);
      } else {
        toast.error(data.message || "Failed to fetch assignments", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("An error occurred while fetching assignments", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return;
    }
    try {
      setDeleting(assignmentId);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token not found", { position: "top-right" });
        setDeleting(null);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/faculty/delete-assignment/${courseId}/${assignmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Assignment deleted successfully", { position: "top-right" });
        setAssignments((prevAssignments) =>
          prevAssignments.filter((assignment) => assignment._id !== assignmentId)
        );
      } else {
        toast.error(data.message || "Failed to delete assignment", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("An error occurred while deleting assignment", { position: "top-right" });
    } finally {
      setDeleting(null);
    }
  };

  const getAssignmentsByCO = (co) => {
    return assignments.filter((assignment) =>
      assignment.co && assignment.co.toLowerCase() === co.toLowerCase()
    );
  };

  const toggleCO = (co) => {
    if (expandedCO === co) {
      setExpandedCO(null);
    } else {
      setExpandedCO(co);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    if (date.$date && date.$date.$numberLong) {
      return new Date(Number(date.$date.$numberLong)).toLocaleDateString();
    }
    return 'N/A';
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {courseOutcomes.map((co) => (
            <div key={co}>
              <button onClick={() => toggleCO(co)}>
                {co} {expandedCO === co ? '▼' : '▶'}
              </button>
              {expandedCO === co && (
                <div>
                  {getAssignmentsByCO(co).map((assignment) => (
                    <div key={assignment._id}>
                      <p>{assignment.title}</p>
                      <p>{assignment.description}</p>
                      <p>{formatDate(assignment.dueDate)}</p>
                      <button onClick={() => deleteAssignment(assignment._id)} disabled={deleting === assignment._id}>
                        {deleting === assignment._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayAssignments;
