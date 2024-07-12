// This component displays the upload history of the user.

import React, { useState, useEffect } from 'react';
import { FaFile, FaCopy } from 'react-icons/fa';

/**
 * The UploadHistory component displays a list of previously uploaded files.
 */
const UploadHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load history from localStorage or API
    const savedHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl mb-4">Upload History</h2>
      <div>
        {history.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-history-item-border hover:bg-history-item-hover transition-colors duration-300">
            <div className="flex items-center">
              <FaFile className="mr-2 text-primary-color" />
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary-color hover:underline">{item.fileName}</a>
              <FaCopy className="ml-2 text-copy-icon-color hover:text-copy-icon-hover-color cursor-pointer" onClick={() => navigator.clipboard.writeText(item.link)} />
            </div>
            <div className="flex items-center space-x-4">
              <span>{item.fileSize}</span>
              <span>{new Date(item.timestamp).toLocaleString()}</span>
              <span className="px-2 py-1 rounded bg-primary-color text-status-tag-text text-sm">{/* Add logic to display status */}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadHistory;