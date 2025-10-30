import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './PolicyUploader.css';

function PolicyUploader({ onPoliciesLoaded }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setFile(selectedFile);
        setFileName(selectedFile.name);
      } catch {
        setFile(null);
        setFileName(null);
        alert("❌ Invalid JSON file");
      }
    };
    reader.readAsText(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setFileName(null);
    onPoliciesLoaded(null);
  };

  const uploadFileToBackend = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/policies", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      // Redirect to another page on success
	    navigate("/success"); // change "/success" to your route
    } catch (err) {
      alert("❌ Upload failed: " + err.message);
    }
  };

  return (
    <div className="container">
      <label>File Upload</label>

      <label className="upload-container">
        <span className="Policy-text">Select Policy JSON</span>
        <div>
          <span className="second-text">
            Drag or drop your JSON file here
          </span>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
          />
        </div>

        {fileName && (
          <div className="file-info">
            <span>{fileName}</span>
            <button type="button" onClick={removeFile}>Remove</button>
            <button type="button" onClick={uploadFileToBackend} className="upload-btn">
              Upload
            </button>
          </div>
        )}
      </label>
    </div>
  );
}

export default PolicyUploader;
