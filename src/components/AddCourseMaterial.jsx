import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import DisplayCourseMaterials from "./DisplayCourseMaterials";

const AddCourseMaterial = ({ courseId }) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    courseId,
    CO: "",
    title: "",
    description: "",
    fileUrl: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [linkdata, setLinkData] = useState("");
  const [refreshMaterials, setRefreshMaterials] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      setFormData({
        ...formData,
        fileUrl: selectedFile
      });
      
      setUploadProgress(0);
      console.log("Selected file:", selectedFile.name, 
                  "Size:", (selectedFile.size / 1024).toFixed(2) + " KB", 
                  "Type:", selectedFile.type);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.courseId) {
      toast.error("Course ID is missing", { position: "top-right" });
      return;
    }
    
    if (!formData.fileUrl) {
      toast.error("Please select a file to upload", { position: "top-right" });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10); // Show initial progress
    
    try {
      // Create FormData object for multipart/form-data submission
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append("courseId", formData.courseId);
      formDataToSend.append("CO", formData.CO);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description || "");
      
      // Add file last (important for some server configurations)
      formDataToSend.append("fileUrl", formData.fileUrl);
      
      // Log what we're sending
      console.log("Sending form data with file:", formData.fileUrl.name);
      
      setUploadProgress(30); // Update progress
      
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/faculty/add-materials", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type when sending FormData
          // Browser will automatically set the correct multipart/form-data with boundary
        },
        body: formDataToSend,
      });
      
      setUploadProgress(90);
      
      const data = await response.json();
      
      if (data.success) {
        setUploadProgress(100);
        console.log(data.material);
        setLinkData(data.material.fileUrl);
        toast.success(data.message, { position: "top-right" });
        
        // Reset form
        setFormData({
          courseId, // Keep the courseId
          CO: "",
          title: "",
          description: "",
          fileUrl: null
        });
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        // Trigger a refresh of materials
        setRefreshMaterials(prev => !prev);
      } else {
        toast.error(data.message, { position: "top-right" });
        console.error("Server error details:", data.details || data.error);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred during upload. Please try again.", { position: "top-right" });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after delay
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Course Material</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="co" className="block text-sm font-medium text-gray-700">Course Outcome (CO)</label>
          <input 
            id="co"
            type="text" 
            name="CO" 
            placeholder="CO (e.g., CO-1)" 
            value={formData.CO} 
            onChange={handleChange} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input 
            id="title"
            type="text" 
            name="title" 
            placeholder="Material Title" 
            value={formData.title} 
            onChange={handleChange} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            id="description"
            name="description" 
            placeholder="Material Description" 
            value={formData.description} 
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700">Upload File</label>
          <input
            id="fileUrl"
            type="file"
            name="fileUrl"
            accept="*/*" // Accept any file type
            onChange={handleFileChange}
            ref={fileInputRef}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            required
          />
        </div>
        
        {formData.fileUrl && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            <p>Selected file: <span className="font-medium">{formData.fileUrl.name}</span></p>
            <p>Size: {(formData.fileUrl.size / 1024).toFixed(2)} KB</p>
            <p>Type: {formData.fileUrl.type || "Unknown"}</p>
          </div>
        )}
        
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isUploading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Upload Material"}
        </button>
      </form>
      
      <DisplayCourseMaterials courseId={courseId} refreshTrigger={refreshMaterials} />
    </div>
  );
};

export default AddCourseMaterial;
