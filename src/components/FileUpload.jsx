// @perama: This component provides a file upload interface using react-dropzone and axios for HTTP requests.
// It manages the upload process, including progress tracking and history management.

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';
import UploadHistory from './UploadHistory';
import config from '../../config';

const UPLOAD_URL = config.upload.url;

const formatSpeed = (bytesPerSecond) => {
  if (bytesPerSecond >= 1073741824) {
    return `${(bytesPerSecond / 1073741824).toFixed(2)} GB/s`;
  } else if (bytesPerSecond >= 1048576) {
    return `${(bytesPerSecond / 1048576).toFixed(2)} MB/s`;
  } else if (bytesPerSecond >= 1024) {
    return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`;
  } else {
    return `${Math.round(bytesPerSecond)} B/s`;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return 'Empty file 👻';
  if (bytes === config.multer.limits.fileSize) return 'Perfection 👌';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * FileUpload component handles file uploads, progress tracking, and history management.
 */
const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [expirationTime, setExpirationTime] = useState(config.upload.defaultExpirationTime);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
      if (Array.isArray(savedHistory)) {
        setHistory(savedHistory);
      } else {
        throw new Error('Invalid history format');
      }
    } catch (error) {
      console.error('Error loading history from localStorage:', error);
      localStorage.removeItem('uploadHistory');
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('uploadHistory', JSON.stringify(history));
    }
  }, [history]);

  /**
   * Update the history item with new information.
   * @param {number} index - The index of the history item to update.
   * @param {Object} newData - The new data to update the history item with.
   */
  const updateHistoryItem = useCallback((index, newData) => {
    setHistory((prevHistory) => {
      const updatedHistory = prevHistory.map((item, i) =>
        i === index ? { ...item, ...newData, expirationTime } : item
      );
      localStorage.setItem('uploadHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, [expirationTime]);

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
    formData.append('expiration', expirationTime.toString());

    const newHistoryItem = {
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      fileType: file.type,
      link: '',
      timestamp: Date.now(), // Add this line to store the upload timestamp
      expirationTime: expirationTime * 60, // Store expiration time in seconds
      progress: 0,
      status: 'Uploading',
      speed: 'N/A',
    };

    setHistory((prevHistory) => [newHistoryItem, ...prevHistory]);
    setUploadStatus('Uploading...');
    setIsUploading(true);

    try {
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          const speed = progressEvent.rate ? formatSpeed(progressEvent.rate) : 'N/A';
          updateHistoryItem(0, {
            progress: percentCompleted,
            speed: speed,
          });
          setUploadStatus(`Uploading... ${percentCompleted}%`);
        },
      });

      if (response.status === 200) {
        const downloadUrl = `http://${window.location.hostname}:${config.downloadPort}/${response.data.fileIds[0]}`;
        updateHistoryItem(0, {
          link: downloadUrl,
          fileId: response.data.fileIds[0],
          status: 'Completed',
          progress: 100,
          speed: '0 KB/s',
        });
        setUploadStatus('File uploaded successfully');
      }
    } catch (error) {
      updateHistoryItem(0, { status: 'Failed' });
      setUploadStatus(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, [expirationTime, updateHistoryItem]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="w-full max-w-4xl mx-auto">
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
        <div className="flex space-x-2 flex-wrap">
          {config.upload.expirationOptions.map((minutes) => (
            <button
              key={minutes}
              onClick={() => setExpirationTime(minutes)}
              className={`px-4 py-2 rounded mb-2 ${
                expirationTime === minutes
                  ? 'bg-active-button text-button-text'
                  : 'bg-button-background text-button-text hover:bg-button-hover'
              }`}
            >
              {minutes === 30 ? '30 minutes' :
               minutes === 60 ? '1 hour' : 
               minutes === 180 ? '3 hours' : 
               minutes === 720 ? '12 hours' : 
               minutes === 1440 ? '1 day' : '3 days'}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center">{uploadStatus}</p>
      <UploadHistory history={history} updateHistory={setHistory} />
    </div>
  );
};

export default FileUpload;