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
      // * Highlight: Position the toast notifications in the bottom-right corner
      position="bottom-right"
      // * Highlight: Auto-close notifications after 5 seconds
      autoClose={5000}
      // * Highlight: Show the progress bar for auto-close timing
      hideProgressBar={false}
      // * Highlight: Display newer toasts below older ones
      newestOnTop={false}
      // * Highlight: Allow closing toasts by clicking on them
      closeOnClick
      // * Highlight: Support right-to-left languages
      rtl={false}
      // * Highlight: Pause auto-close timer when the window loses focus
      pauseOnFocusLoss
      // * Highlight: Allow dragging toasts to dismiss them
      draggable
      // * Highlight: Pause auto-close timer when hovering over a toast
      pauseOnHover
      // * Highlight: Use a colored theme for better visibility
      theme="colored"
      // * Highlight: Apply custom CSS classes for styling
      toastClassName="bg-toast-background text-toast-text backdrop-blur-md bg-opacity-80"
    />
  );
};

// ! Alert: Ensure that the CSS variables used in toastClassName are defined in your global styles
// TODO: Consider adding custom icons or animations to the toast notifications
// @param position: Determines where the toasts appear on the screen
// @param theme: Controls the overall look of the toasts (light, dark, or colored)

export default CustomToast;