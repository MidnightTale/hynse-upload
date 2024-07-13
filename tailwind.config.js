/** @type {import('tailwindcss').Config} */
module.exports = {
  // * Highlight: Define content sources for Tailwind to scan for classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  // * Highlight: Enable dark mode using the 'class' strategy
  darkMode: 'class',
  theme: {
    extend: {
      // * Highlight: Extend the default color palette with custom colors
      colors: {
        // @param --app-background: Main background color for the application
        'app-background': 'var(--app-background)',
        // @param --text-color: Primary text color
        'text-color': 'var(--text-color)',
        // @param --primary-color: Primary accent color
        'primary-color': 'var(--primary-color)',
        // @param --dropzone-color: Color for the dropzone border
        'dropzone-color': 'var(--dropzone-color)',
        // @param --dropzone-background: Background color for the dropzone
        'dropzone-background': 'var(--dropzone-background)',
        // @param --dropzone-hover-background: Background color for dropzone on hover
        'dropzone-hover-background': 'var(--dropzone-hover-background)',
        // @param --progress-bar-background: Background color for progress bars
        'progress-bar-background': 'var(--progress-bar-background)',
        // @param --input-border: Border color for input elements
        'input-border': 'var(--input-border)',
        // @param --input-background: Background color for input elements
        'input-background': 'var(--input-background)',
        // @param --input-text: Text color for input elements
        'input-text': 'var(--input-text)',
        // @param --popup-text: Text color for popup elements
        'popup-text': 'var(--popup-text)',
        // @param --primary-color-popup: Primary color for popup elements
        'primary-color-popup': 'var(--primary-color-popup)',
        // @param --button-text: Text color for buttons
        'button-text': 'var(--button-text)',
        // @param --button-background: Background color for buttons
        'button-background': 'var(--button-background)',
        // @param --button-border: Border color for buttons
        'button-border': 'var(--button-border)',
        // @param --button-hover: Color for button hover state
        'button-hover': 'var(--button-hover)',
        // @param --button-hover-background: Background color for button hover state
        'button-hover-background': 'var(--button-hover-background)',
        // @param --button-border-active: Border color for active button state
        'button-border-active': 'var(--button-border-active)',
        // @param --button-border-hover: Border color for button hover state
        'button-border-hover': 'var(--button-border-hover)',
        // @param --history-item-border: Border color for history items
        'history-item-border': 'var(--history-item-border)',
        // @param --history-item-hover: Background color for history item hover state
        'history-item-hover': 'var(--history-item-hover)',
        // @param --history-item-text: Text color for history items
        'history-item-text': 'var(--history-item-text)',
        // @param --status-tag-text: Text color for status tags
        'status-tag-text': 'var(--status-tag-text)',
        // @param --expired-color: Color for expired items
        'expired-color': 'var(--expired-color)',
        // @param --low-expiration-color: Color for items close to expiration
        'low-expiration-color': 'var(--low-expiration-color)',
        // @param --low-expiration-text: Text color for items close to expiration
        'low-expiration-text': 'var(--low-expiration-text)',
        // @param --active-button: Color for active button state
        'active-button': 'var(--active-button)',
        // @param --copy-icon-color: Color for copy icons
        'copy-icon-color': 'var(--copy-icon-color)',
        // @param --copy-icon-hover-color: Color for copy icons on hover
        'copy-icon-hover-color': 'var(--copy-icon-hover-color)',
        // @param --copy-icon-active-color: Color for copy icons in active state
        'copy-icon-active-color': 'var(--copy-icon-active-color)',
        // @param --overlay-background-color: Background color for overlays
        'overlay-background-color': 'var(--overlay-background-color)',
        // @param --overlay-content-background-color: Background color for overlay content
        'overlay-content-background-color': 'var(--overlay-content-background-color)',
        // @param --overlay-content-text-color: Text color for overlay content
        'overlay-content-text-color': 'var(--overlay-content-text-color)',
        // @param --overlay-closebtn-color: Color for overlay close button
        'overlay-closebtn-color': 'var(--overlay-closebtn-color)',
        // @param --overlay-closebtn-hover-color: Color for overlay close button on hover
        'overlay-closebtn-hover-color': 'var(--overlay-closebtn-hover-color)',
        // @param --toast-background: Background color for toast notifications
        'toast-background': 'rgba(var(--toast-background-rgb), 0.7)',
        // @param --toast-border: Border color for toast notifications
        'toast-border': 'rgba(var(--toast-border-rgb), 0.2)',
        // @param --toast-progress-bar: Color for toast notification progress bar
        'toast-progress-bar': 'var(--toast-progress-bar)',
      },
    },
  },
  // * Highlight: Add any custom plugins here
  plugins: [],
};

// ! Alert: Ensure all CSS variables are properly defined in your global styles

// TODO: Consider adding responsive variants for custom colors if needed
// TODO: Explore additional Tailwind plugins that might enhance the project