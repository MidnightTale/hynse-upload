// @perama: This component displays the upload history of the user with pagination.
// It shows a list of uploaded files with their status, progress, and download links.
// The component uses a card-like style with rounded corners and a glassy effect.
// It supports dark mode and provides a responsive layout for various screen sizes.
// A download button has been added to allow direct file downloads from the history item.

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  FaFile, FaCopy, FaChevronLeft, FaChevronRight, 
  FaFileImage, FaFileAudio, FaFileVideo, FaFilePdf, 
  FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileArchive, 
  FaFileCode, FaFileAlt, FaDownload
} from 'react-icons/fa';
import ProgressBar from './ProgressBar';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import copy from 'clipboard-copy';
import { logInfo, logError } from './clientLogUtil';
import appConfig from '../../config';

const ITEMS_PER_PAGE = 7;

/**
 * UploadHistory component displays a paginated list of uploaded files and their status.
 * @param {Object} props - The component props.
 * @param {Array} props.history - The array of upload history items.
 * @param {Function} props.updateHistory - The function to update the history state.
 */
const UploadHistory = ({ history = [], updateHistory }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const lastUpdateTimeRef = useRef(Date.now());
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);

  /**
   * Get the current page items with dummy items added if needed.
   * @returns {Array} Array of history items for the current page.
   */
  const getCurrentPageItems = useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageItems = history.slice(startIndex, endIndex);
    
    // Add dummy items if needed
    const dummyItemsCount = ITEMS_PER_PAGE - pageItems.length;
    for (let i = 0; i < dummyItemsCount; i++) {
      pageItems.push({ isDummy: true });
    }
    
    return pageItems;
  }, [currentPage, history]);

  /**
   * Copy the given text to the clipboard and show a toast notification.
   * @param {string} text - The text to copy to the clipboard.
   */
  const copyToClipboard = async (fileId) => {
    try {
      const downloadDomain = appConfig.download.usePublicDomain 
        ? `https://${appConfig.download.publicDomain}` 
        : `http://${appConfig.download.hostname}:${appConfig.download.port}`;
      const downloadUrl = `${downloadDomain}/${fileId}`;
      
      await copy(downloadUrl);
      toast.success('Link copied to clipboard', {
        className: 'bg-toast-background text-toast-text',
      });
      logInfo('Link copied to clipboard', { downloadUrl });
    } catch (err) {
      logError('Failed to copy text to clipboard', { error: err.message });
      toast.error('Failed to copy link', {
        className: 'bg-toast-background text-toast-text',
      });
    }
  };

  /**
   * Format the date for display, showing relative time or full date based on hover state.
   * @param {number} timestamp - The timestamp to format.
   * @param {number} index - The index of the history item.
   * @returns {string} Formatted date string.
   */
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

  /**
   * Calculate the time left before file expiration.
   * @param {number} timestamp - The upload timestamp.
   * @param {number} expirationTime - The expiration time in minutes.
   * @returns {Object} An object with the formatted time left and a boolean indicating if the time is near expiry.
   */
  const calculateTimeLeft = useCallback((timestamp, expirationTime) => {
    if (!timestamp || !expirationTime) return 'N/A';
    const now = new Date();
    const uploadDate = new Date(timestamp);
    const expirationDate = new Date(uploadDate.getTime() + expirationTime * 60000);
    const timeLeft = expirationDate - now;
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (24 * 3600000));
    const hours = Math.floor((timeLeft % (24 * 3600000)) / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    if (days > 0) {
      return { text: days === 1 ? '1 Day' : `${days} Days`, isNearExpiry: false };
    } else if (hours > 0 || minutes > 30) {
      return { text: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, isNearExpiry: false };
    } else {
      return { text: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, isNearExpiry: true };
    }
  }, []);

  /**
   * Check for expired files and show toast notifications for newly expired files.
   */
  const checkForExpiredFiles = useCallback(() => {
    const now = new Date();
    history.forEach((item, index) => {
      if (!item.isDummy && item.status === 'Completed') {
        const uploadDate = new Date(item.timestamp);
        const expirationDate = new Date(uploadDate.getTime() + item.expirationTime * 60000);
        if (now > expirationDate && !item.hasShownExpirationToast) {
          updateHistory(prevHistory => {
            const newHistory = [...prevHistory];
            newHistory[index] = { ...newHistory[index], hasShownExpirationToast: true };
            return newHistory;
          });
        }
      }
    });
  }, [history, updateHistory]);

  useEffect(() => {
    const interval = setInterval(checkForExpiredFiles, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkForExpiredFiles]);

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

  /**
   * Get the appropriate icon based on the file type.
   * @param {string} fileType - The MIME type of the file.
   * @returns {JSX.Element} The icon component for the file type.
   */
  const getFileIcon = (fileType) => {
    const iconProps = { className: "text-3xl mr-4" };
    switch (true) {
      case /^image\//.test(fileType):
        return <FaFileImage {...iconProps} className={`${iconProps.className} text-green-500`} />;
      case /^audio\//.test(fileType):
        return <FaFileAudio {...iconProps} className={`${iconProps.className} text-purple-500`} />;
      case /^video\//.test(fileType):
        return <FaFileVideo {...iconProps} className={`${iconProps.className} text-red-500`} />;
      case /^application\/pdf/.test(fileType):
        return <FaFilePdf {...iconProps} className={`${iconProps.className} text-red-700`} />;
      case /^application\/(msword|vnd.openxmlformats-officedocument.wordprocessingml|vnd.oasis.opendocument.text)/.test(fileType):
        return <FaFileWord {...iconProps} className={`${iconProps.className} text-blue-700`} />;
      case /^application\/(vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml|vnd.oasis.opendocument.spreadsheet)/.test(fileType):
        return <FaFileExcel {...iconProps} className={`${iconProps.className} text-green-700`} />;
      case /^application\/(vnd.ms-powerpoint|vnd.openxmlformats-officedocument.presentationml|vnd.oasis.opendocument.presentation)/.test(fileType):
        return <FaFilePowerpoint {...iconProps} className={`${iconProps.className} text-orange-600`} />;
      case /^application\/(zip|x-rar-compressed|x-7z-compressed|x-tar|x-gzip)/.test(fileType):
        return <FaFileArchive {...iconProps} className={`${iconProps.className} text-yellow-600`} />;
      case /^text\/(html|css|javascript|xml|x-python|x-java-source|x-c)/.test(fileType):
        return <FaFileCode {...iconProps} className={`${iconProps.className} text-gray-600`} />;
      case /^text\//.test(fileType):
        return <FaFileAlt {...iconProps} className={`${iconProps.className} text-gray-500`} />;
      case /^application\/(json|xml|javascript)/.test(fileType):
        return <FaFileCode {...iconProps} className={`${iconProps.className} text-gray-600`} />;
      case /^application\/(octet-stream|x-executable|x-msdownload)/.test(fileType):
        return <FaFile {...iconProps} className={`${iconProps.className} text-blue-500`} />;
      default:
        return <FaFile {...iconProps} className={`${iconProps.className} text-blue-500`} />;
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl mb-4">File Transfer Status</h2>
      <div className="space-y-4">
      {getCurrentPageItems().map((item, index) => (
        <div 
          key={index} 
          className={`p-4 rounded-lg backdrop-blur-md bg-opacity-80 transition-all duration-300 ease-in-out ${
            item.isDummy ? 'invisible opacity-0' : 'hover:bg-history-item-hover-background'
          } bg-history-item-background text-history-item-text shadow-[0_0_0_1px_var(--history-item-border-color),0_2px_4px_rgba(0,0,0,0.1)] border-[var(--history-item-outline)]`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="flex items-center">
            <div className={`flex items-center w-3/5 transition-all duration-300`}>
              {item.isDummy ? <FaFile className="text-3xl mr-4 text-gray-300" /> : getFileIcon(item.fileType)}
              <div className="flex flex-col overflow-hidden">
                <span 
                  className="text-lg font-semibold truncate"
                  title={item.fileName || 'Dummy File'}
                >
                  {item.fileName || 'Dummy File'}
                </span>
                <div className="text-sm opacity-70">
                  <span className="cursor-default no-underline">
                    {item.isDummy ? 'N/A' : formatDate(item.timestamp, index)}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{item.fileSize || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className={`${item.status === 'Completed' ? 'w-1/5' : 'w-1/3'} transition-all duration-300`}>
              {!item.isDummy && item.status !== 'Completed' && (
                <ProgressBar 
                  progress={item.progress} 
                  uploadStatus={item.status} 
                  speed={item.speed} 
                />
              )}
            </div>
            <div className="flex items-center justify-end w-1/5 space-x-2">
              <span className={`px-2 py-1 rounded text-white text-sm ${
                item.isDummy ? 'bg-[var(--status-tag-dummy)]' :
                item.status === 'Failed' ? 'bg-[var(--status-tag-failed)]' :
                item.status === 'Completed' ? 
                  (() => {
                    const timeLeft = calculateTimeLeft(item.timestamp, item.expirationTime);
                    if (timeLeft === 'Expired') return 'bg-[var(--status-tag-expired)]';
                    if (timeLeft.isNearExpiry) return 'bg-[var(--status-tag-near-expiry)]';
                    return 'bg-[var(--status-tag-active)]';
                  })() :
                'bg-[var(--status-tag-uploading)]'
              }`}>
                {item.isDummy ? 'N/A' : (item.status === 'Completed' 
                  ? calculateTimeLeft(item.timestamp, item.expirationTime).text 
                  : item.status)}
              </span>
              {!item.isDummy && (
                <>
                  <button
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={() => copyToClipboard(item.fileId)}
                    title="Copy download link"
                  >
                    <FaCopy />
                  </button>
                  <a
                    href={`${appConfig.download.usePublicDomain 
                      ? `https://${appConfig.download.publicDomain}` 
                      : `http://${appConfig.download.hostname}:${appConfig.download.port}`}/${item.fileId}`}
                    download
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    title="Download file"
                  >
                    <FaDownload />
                  </a>
                </>
              )}
            </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="mr-2 px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadHistory;