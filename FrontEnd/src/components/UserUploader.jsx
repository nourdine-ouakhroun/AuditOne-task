import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // for page navigation
import './UserUploader.css'; // optional, style like PolicyUploader

function UserUploader({ onUsersLoaded }) {
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
        // optional: send data to parent
        onUsersLoaded && onUsersLoaded(json);
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
    onUsersLoaded && onUsersLoaded(null);
  };

  const uploadFileToBackend = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/users", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      // Redirect after successful upload
      navigate("/resulte"); // change this route to your success page
    } catch (err) {
      alert("❌ Upload failed: " + err.message);
    }
  };

  return (
    <div className="container">
      <label>User Upload</label>

      <label className="upload-container">
        <span className="Policy-text">Select Users JSON</span>
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

export default UserUploader;
