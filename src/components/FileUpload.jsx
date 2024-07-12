// This component provides a file upload interface using react-dropzone and axios for HTTP requests.

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const UPLOAD_URL = '/api/upload/requestUpload';

/**
 * This component renders a file upload interface using react-dropzone and axios for HTTP requests.
 */
const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handle file drop event.
   * @param {Array} acceptedFiles - The accepted files.
   */
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setUploadStatus('No file selected');
      return;
    }

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('files', file);

    setUploadStatus('Uploading...');
    setIsUploading(true);

    try {
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('File uploaded successfully');
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} disabled={isUploading} />
        <p>Drag 'n' drop a file here, or click to select a file</p>
        <p>{uploadStatus}</p>
      </div>
    </div>
  );
};

export default FileUpload;