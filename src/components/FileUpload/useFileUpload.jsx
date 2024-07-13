// @perama: This custom hook manages the file upload state and logic.
// It handles file uploads, expiration time selection, and upload history.

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import config from '../../../config';
import { formatFileSize, formatSpeed } from './formatUtils';
import { logInfo, logError, logWarn } from '../clientLogUtil';
import { toast } from 'react-toastify';

const UPLOAD_URL = config.upload.url;

const useFileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [expirationTime, setExpirationTime] = useState(config.upload.defaultExpirationTime);
  const [history, setHistory] = useState([]);

  // Load history from localStorage and remove expired items
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
      if (Array.isArray(savedHistory)) {
        const currentTime = Date.now();
        const updatedHistory = savedHistory.filter(item => {
          const expirationTime = new Date(item.timestamp).getTime() + item.expirationTime * 60000;
          return currentTime < expirationTime;
        });
        setHistory(updatedHistory);
        localStorage.setItem('uploadHistory', JSON.stringify(updatedHistory));
        logInfo('Upload history loaded and cleaned from localStorage', { historyLength: updatedHistory.length });
      } else {
        throw new Error('Invalid history format');
      }
    } catch (error) {
      logError('Error loading history from localStorage', { error: error.message });
      localStorage.removeItem('uploadHistory');
      setHistory([]);
    }
  }, []);

  const prevHistoryLengthRef = useRef(0);

  useEffect(() => {
    if (history.length > 0 && history.length !== prevHistoryLengthRef.current) {
      try {
        localStorage.setItem('uploadHistory', JSON.stringify(history));
        logInfo('Upload history saved to localStorage', { historyLength: history.length });
      } catch (error) {
        logError('Error saving history to localStorage', { error: error.message });
      }
      prevHistoryLengthRef.current = history.length;
    }
  }, [history]);

  const updateHistoryItem = useCallback((index, newData) => {
    setHistory((prevHistory) => {
      const updatedHistory = prevHistory.map((item, i) =>
        i === index ? { ...item, ...newData, expirationTime } : item
      );
      try {
        const currentTime = Date.now();
        const cleanedHistory = updatedHistory.filter(item => {
          const itemExpirationTime = new Date(item.timestamp).getTime() + item.expirationTime * 60000;
          return currentTime < itemExpirationTime;
        });
        localStorage.setItem('uploadHistory', JSON.stringify(cleanedHistory));
        logInfo('History item updated and expired items removed', { index, newData });
      } catch (error) {
        logError('Error updating history item', { error: error.message });
      }
      return updatedHistory;
    });
  }, [expirationTime]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        setUploadStatus('No file selected');
        logWarn('No file selected for upload');
        toast.error('No file selected for upload', {
          className: 'bg-toast-background text-toast-text',
        });
        return;
      }

      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
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

      const toastId = toast.loading(`Starting upload: ${file.name}`, {
        className: 'bg-toast-background text-toast-text',
      });

      try {
        logInfo('Starting file upload', { fileName: file.name, fileSize: file.size });
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
            setUploadStatus(`${percentCompleted}%`);
            logInfo('Upload progress', { percentCompleted, speed });
            
            toast.update(toastId, {
              render: `Uploading ${file.name}: ${percentCompleted}%`,
            });
          },
        });

        if (response.status === 200) {
          updateHistoryItem(0, {
            progress: 100,
            speed: '0 KB/s',
            status: 'Completed',
          });
          setUploadStatus('File uploaded successfully');

          const downloadUrl = config.usePublicDomain
            ? `https://${config.downloadHostname}/${response.data.fileIds[0]}`
            : `http://${config.main.hostname}:${config.download.port}/${response.data.fileIds[0]}`;
          updateHistoryItem(0, {
            link: downloadUrl,
            fileId: response.data.fileIds[0],
          });
          logInfo('File upload completed successfully', { fileId: response.data.fileIds[0] });

          toast.update(toastId, {
            render: `${file.name} uploaded successfully!`,
            type: 'success',
            isLoading: false,
            autoClose: 5000,
          });
        }
      } catch (error) {
        updateHistoryItem(0, { status: 'Failed' });
        const errorMessage = error.response?.data?.error || error.message;
        const statusCode = error.response?.status || 500;
        setUploadStatus(`Upload failed: ${errorMessage}`);
        logError('File upload failed', { error: errorMessage }, statusCode);

        toast.update(toastId, {
          render: `${file.name} upload failed. Please try again.`,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      } finally {
        setIsUploading(false);
      }
    },
    [expirationTime, updateHistoryItem]
  );

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