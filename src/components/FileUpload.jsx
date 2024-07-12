// This component provides a file upload interface using react-dropzone and axios for HTTP requests.

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';

const UPLOAD_URL = '/api/upload/requestUpload';

/**
 * This component renders a file upload interface using react-dropzone and axios for HTTP requests.
 */
const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [expirationTime, setExpirationTime] = useState(60);

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
    formData.append('expiration', expirationTime);

    setUploadStatus('Uploading...');
    setIsUploading(true);

    try {
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('File uploaded successfully');
      setDownloadLink(response.data.urls[0]);
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, [expirationTime]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps({
          className: "border-2 border-dashed border-dropzone-color p-8 rounded-lg bg-dropzone-background cursor-pointer hover:bg-dropzone-hover-background transition-colors duration-300 ease-in-out flex items-center justify-center h-48 text-center",
        })}
        style={{ pointerEvents: isUploading ? 'none' : 'auto' }}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <p className="text-lg">Drag 'n' drop a file here, or click to select a file</p>
      </div>
      <div className="mt-4">
        <label htmlFor="expiration" className="block mb-2">Select expiration time:</label>
        <div className="flex space-x-2">
          {[60, 180, 720, 1440, 4320].map((minutes) => (
            <button
              key={minutes}
              onClick={() => setExpirationTime(minutes)}
              className={`px-4 py-2 rounded ${
                expirationTime === minutes
                  ? 'bg-active-button text-button-text'
                  : 'bg-button-background text-button-text hover:bg-button-hover'
              }`}
            >
              {minutes === 60 ? '1 hour' : 
               minutes === 180 ? '3 hours' : 
               minutes === 720 ? '12 hours' : 
               minutes === 1440 ? '1 day' : '3 days'}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center">{uploadStatus}</p>
      {downloadLink && (
        <div className="mt-4 flex items-center justify-between">
          <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="text-primary-color hover:underline">{downloadLink}</a>
          <button onClick={() => navigator.clipboard.writeText(downloadLink)} className="ml-2 px-4 py-2 bg-button-background text-button-text rounded hover:bg-button-hover">Copy URL</button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;