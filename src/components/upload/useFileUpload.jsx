// @perama: This custom hook manages file uploads, including multi-file compression with progress indication.
// It uses promise-based toasts to show compression and upload progress.

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import config from '../../../config';
import { formatFileSize, formatSpeed } from '../utils/formatUtils';
import { logInfo, logError, logWarn } from '../utils/clientLogUtil';
import { toast } from 'react-toastify';

const UPLOAD_URL = config.upload.url;

const useFileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [expirationTime, setExpirationTime] = useState(() => {
    const savedExpiration = localStorage.getItem('expirationTime');
    return savedExpiration ? parseInt(savedExpiration, 10) : config.upload.defaultExpirationTime;
  });
  const [history, setHistory] = useState([]);

  // Load history from localStorage and remove expired items
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
      if (Array.isArray(savedHistory)) {
        const currentTime = Date.now();
        const updatedHistory = savedHistory.filter(item => {
          const expirationTime = new Date(item.timestamp).getTime() + item.expirationTime * 60000;
          return currentTime < expirationTime && item.status !== 'Failed';
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
        const successfulUploads = history.filter(item => item.status !== 'Failed');
        localStorage.setItem('uploadHistory', JSON.stringify(successfulUploads));
        logInfo('Upload history saved to localStorage', { historyLength: successfulUploads.length });
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
        setUploadStatus('No files selected');
        logWarn('No files selected for upload');
        toast.error('No files selected for upload', {
          className: 'bg-toast-background text-toast-text',
        });
        return;
      }

      setIsUploading(true);

      let filesToUpload;
      let fileName;

      if (acceptedFiles.length > 1) {
        // Start a promise-based toast for compression
        const compressToastId = toast.loading('Compressing files...', {
          className: 'bg-toast-background text-toast-text',
        });

        try {
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          
          // Add files to the zip
          acceptedFiles.forEach((file) => {
            zip.file(file.name, file);
          });

          // Generate the zip file with progress updates
          const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
            const progress = Math.round(metadata.percent);
            toast.update(compressToastId, {
              render: `Compressing files: ${progress}%`,
            });
          });

          const randomString = Math.random().toString(36).substring(2, 8);
          const timestamp = Date.now();
          fileName = `archive_${timestamp}_${randomString}.zip`;
          filesToUpload = [new File([content], fileName, { type: 'application/zip' })];

          // Update toast to show completion
          toast.update(compressToastId, {
            render: 'Files compressed successfully',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
          });
        } catch (error) {
          logError('Error compressing files', { error: error.message });
          toast.update(compressToastId, {
            render: 'Error compressing files. Please try again.',
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
          setIsUploading(false);
          return;
        }
      } else {
        filesToUpload = acceptedFiles;
        fileName = acceptedFiles[0].name;
      }

      const formData = new FormData();
      formData.append('files', filesToUpload[0]);
      formData.append('expiration', expirationTime.toString());

      const newHistoryItem = {
        fileName: fileName,
        fileSize: formatFileSize(filesToUpload[0].size),
        fileType: filesToUpload[0].type,
        link: '',
        timestamp: Date.now(),
        expirationTime: expirationTime * 60,
        progress: 0,
        status: 'Uploading',
        speed: 'N/A',
      };

      setHistory((prevHistory) => [newHistoryItem, ...prevHistory]);
      setUploadStatus('Uploading...');

      const toastId = toast.loading(`Starting upload: ${fileName}`, {
        className: 'bg-toast-background text-toast-text',
      });

      try {
        logInfo('Starting file upload', { fileName: fileName, fileSize: filesToUpload[0].size });
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
            logInfo('Upload progress', { fileName: fileName, percentCompleted, speed });
            
            toast.update(toastId, {
              render: `Uploading ${fileName}: ${percentCompleted}%`,
            });
          },
        });

        if (response.status === 200) {
          updateHistoryItem(0, {
            progress: 100,
            speed: '0 KB/s',
            status: 'Completed',
          });

          const downloadUrl = config.usePublicDomain
            ? `https://${config.downloadHostname}/${response.data.fileIds[0]}`
            : `http://${config.main.hostname}:${config.download.port}/${response.data.fileIds[0]}`;
          updateHistoryItem(0, {
            link: downloadUrl,
            fileId: response.data.fileIds[0],
          });
          logInfo('File upload completed successfully', { fileName: fileName, fileId: response.data.fileIds[0] });

          toast.update(toastId, {
            render: `${fileName} uploaded successfully!`,
            type: 'success',
            isLoading: false,
            autoClose: 5000,
          });
        }
      } catch (error) {
        updateHistoryItem(0, { status: 'Failed', progress: 0 });
        const errorMessage = error.response?.data?.error || error.message;
        const statusCode = error.response?.status || 500;
        setUploadStatus(`Upload failed: ${errorMessage}`);
        logError('File upload failed', { fileName: fileName, error: errorMessage }, statusCode);

        toast.update(toastId, {
          render: `${fileName} upload failed. Please try again.`,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      }

      setIsUploading(false);
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