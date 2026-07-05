import React, { useState } from 'react';

interface FileUploadProps {
  onFileUpload: (fileName: string, fileContent: string, fileType: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const fileContent = await file.text();
      onFileUpload(file.name, fileContent, file.type);
      e.target.value = ''; // Reset input
    } catch (error) {
      console.error('Failed to read file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <label htmlFor="file-input" className="file-upload-label">
        📎 Attach File
      </label>
      <input
        id="file-input"
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        className="file-upload-input"
      />
    </div>
  );
};

export default FileUpload;
