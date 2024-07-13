// @perama: This custom hook manages the file upload state and logic.
// It handles file uploads, expiration time selection, and upload history.
// The hook integrates with localStorage for persistent history storage.

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import config from '../../../config';
import { formatFileSize, formatSpeed } from './formatUtils';
import { logInfo, logError, logWarn } from '../clientLogUtil';
import { toast } from 'react-toastify';

// * Highlight: Upload URL is fetched from the config file for easy modification
const UPLOAD_URL = config.upload.url;

/**
 * Custom hook for managing file upload functionality
 * @returns {Object} An object containing upload-related state and functions
 * 
 * ! Alert: This hook assumes that the server can handle the file size and type.
 * TODO: Implement client-side file size and type validation before upload.
 */
const useFileUpload = () => {
  // @param uploadStatus: string - Current status of the upload process
  const [uploadStatus, setUploadStatus] = useState('');
  // @param isUploading: boolean - Indicates if a file is currently being uploaded
  const [isUploading, setIsUploading] = useState(false);
  // @param expirationTime: number - Selected expiration time for uploaded files
  const [expirationTime, setExpirationTime] = useState(config.upload.defaultExpirationTime);
  // @param history: Array - Upload history of files
  const [history, setHistory] = useState([]);

  // * Highlight: Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
      if (Array.isArray(savedHistory)) {
        setHistory(savedHistory);
        logInfo('Upload history loaded from localStorage', { historyLength: savedHistory.length });
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

  // * Highlight: Save history to localStorage whenever it changes
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

  /**
   * Updates a specific item in the upload history
   * @param {number} index - Index of the history item to update
   * @param {Object} newData - New data to merge with the existing history item
   * 
   * ! Alert: This function assumes that the index is valid and newData is properly formatted
   */
  const updateHistoryItem = useCallback((index, newData) => {
    setHistory((prevHistory) => {
      const updatedHistory = prevHistory.map((item, i) =>
        i === index ? { ...item, ...newData, expirationTime } : item
      );
      try {
        localStorage.setItem('uploadHistory', JSON.stringify(updatedHistory));
        logInfo('History item updated', { index, newData });
      } catch (error) {
        logError('Error updating history item', { error: error.message });
      }
      return updatedHistory;
    });
  }, [expirationTime]);

  /**
   * Handles file drop event and initiates file upload
   * @param {File[]} acceptedFiles - Array of accepted files from the drop event
   * 
   * ! Alert: This function assumes that the server can handle the file size and type
   * TODO: Implement file type and size validation before upload
   */
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        setUploadStatus('No file selected');
        logWarn('No file selected for upload');
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

      const toastId = toast.loading('Starting file upload...', {
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
            setUploadStatus(`Uploading... ${percentCompleted}%`);
            logInfo('Upload progress', { percentCompleted, speed });
            
            toast.update(toastId, {
              render: `Uploading... ${percentCompleted}%`,
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

          // * Highlight: Generate download URL based on configuration
          const downloadUrl = config.usePublicDomain
            ? `https://${config.downloadHostname}/${response.data.fileIds[0]}`
            : `http://${config.main.hostname}:${config.download.port}/${response.data.fileIds[0]}`;
          updateHistoryItem(0, {
            link: downloadUrl,
            fileId: response.data.fileIds[0],
          });
          logInfo('File upload completed successfully', { fileId: response.data.fileIds[0] });

          toast.update(toastId, {
            render: 'File uploaded successfully!',
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
          render: 'File upload failed. Please try again.',
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