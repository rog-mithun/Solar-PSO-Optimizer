// UploadForm.js
import React, { useState } from "react";
import { uploadDataset } from "../api";

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❗ Please select a CSV file.");
      return;
    }

    try {
      const response = await uploadDataset(file);
      if (response.data?.message) {
        setMessage("✅ Upload successful!");
        onUploadSuccess(response.data.path);
      } else {
        setMessage("❌ Invalid CSV format.");
      }
    } catch (err) {
      setMessage("❌ Error uploading file.");
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="text-lg font-semibold mb-2">📤 Upload Custom Dataset</h3>
      <div className="flex flex-col items-center space-y-2">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload
        </button>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default UploadForm;