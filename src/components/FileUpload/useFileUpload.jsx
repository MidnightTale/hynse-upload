// @perama: This custom hook manages the file upload state and logic.

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../../../config';
import { formatFileSize, formatSpeed } from './formatUtils';

const UPLOAD_URL = config.upload.url;

const useFileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [expirationTime, setExpirationTime] = useState(config.upload.defaultExpirationTime);
  const [history, setHistory] = useState([]);

  // Load history from localStorage
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

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('uploadHistory', JSON.stringify(history));
    }
  }, [history]);

  const updateHistoryItem = useCallback((index, newData) => {
    setHistory((prevHistory) => {
      const updatedHistory = prevHistory.map((item, i) =>
        i === index ? { ...item, ...newData, expirationTime } : item
      );
      localStorage.setItem('uploadHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, []);

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
      timestamp: Date.now(),
      expirationTime: expirationTime * 60,
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

  return {
    uploadStatus,
    isUploading,
    expirationTime,
    history,
    setExpirationTime,
    onDrop,
    setHistory
  };
};

export default useFileUpload;