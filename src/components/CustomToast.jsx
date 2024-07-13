// @perama: This component sets up the ToastContainer for react-toastify notifications.
// It configures the position, theme, and other options for toast notifications.
// The component uses CSS variables for theming and applies a glassy effect using backdrop-filter.

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * CustomToast component for configuring and rendering the ToastContainer.
 * @returns {JSX.Element} The ToastContainer component with custom configuration.
 */
const CustomToast = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      toastClassName="bg-toast-background text-toast-text backdrop-blur-md bg-opacity-80"
    />
  );
};

export default CustomToast;