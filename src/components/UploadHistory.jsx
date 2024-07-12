// @perama: This component displays the upload history of the user.
// It shows a list of uploaded files with their status, progress, and download links.

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FaFile, FaCopy } from 'react-icons/fa';
import ProgressBar from './ProgressBar';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import copy from 'clipboard-copy';

/**
 * UploadHistory component displays a list of uploaded files and their status.
 * @param {Object} props - The component props.
 * @param {Array} props.history - The array of upload history items.
 * @param {Function} props.updateHistory - The function to update the history state.
 */
const UploadHistory = ({ history = [], updateHistory }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const lastUpdateTimeRef = useRef(Date.now());

  /**
   * Copy the given text to the clipboard.
   * @param {string} text - The text to copy.
   */
  const copyToClipboard = async (text) => {
    try {
      await copy(text);
      toast.success('Link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy link');
    }
  };

  const formatDate = useCallback((timestamp, index) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return hoveredIndex === index
      ? new Intl.DateTimeFormat(undefined, { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }).format(date)
      : formatDistanceToNow(date, { addSuffix: true });
  }, [hoveredIndex]);

  const calculateTimeLeft = useCallback((timestamp, expirationTime) => {
    if (!timestamp || !expirationTime) return 'N/A';
    const now = new Date();
    const uploadDate = new Date(timestamp);
    const expirationDate = new Date(uploadDate.getTime() + expirationTime * 60000);
    const timeLeft = expirationDate - now;
    if (timeLeft <= 0) return 'Expired';
    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    let timeString = '';
    if (hours > 0) timeString += `${hours}:`;
    if (hours > 0 || minutes > 0) timeString += `${minutes.toString().padStart(2, '0')}:`;
    timeString += seconds.toString().padStart(2, '0');
    
    return timeString;
  }, []);

  useEffect(() => {
    if (typeof updateHistory === 'function') {
      const updateInterval = 500; // Update every 500 ms

      const timer = setInterval(() => {
        const now = Date.now();
        if (now - lastUpdateTimeRef.current >= updateInterval) {
          updateHistory(prevHistory => [...prevHistory]);
          lastUpdateTimeRef.current = now;
        }
      }, 100); // Check every 100ms, but only update if enough time has passed

      return () => clearInterval(timer);
    }
  }, [updateHistory]);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 [&_span[title]]:hover:underline">
      <h2 className="text-2xl mb-4">File Transfer Status</h2>
      <div>
        {history.map((item, index) => (
          <div key={index} className="flex items-center py-4 border-b border-history-item-border hover:bg-history-item-hover transition-colors duration-300">
            <div className="flex items-center w-1/2">
              <FaFile className="text-3xl mr-4 text-blue-500" />
              <div className="flex flex-col">
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-500 hover:underline truncate">{item.fileName}</a>
                <div className="text-sm text-gray-500">
                  <span 
                    className="cursor-default"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {formatDate(item.timestamp, index)}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{item.fileSize}</span>
                </div>
              </div>
            </div>
            <div className="w-1/3">
              <ProgressBar progress={item.progress} uploadStatus={item.status} speed={item.speed} />
            </div>
            <div className="flex items-center justify-end w-1/6">
              <span className="px-2 py-1 rounded bg-blue-500 text-white text-sm mr-2">
                {item.status === 'Completed' 
                  ? calculateTimeLeft(item.timestamp, item.expirationTime) 
                  : item.status}
              </span>
              <button
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={() => copyToClipboard(item.link)}
              >
                <FaCopy />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadHistory;