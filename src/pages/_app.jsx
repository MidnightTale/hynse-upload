// @perama: This file is the custom App component for Next.js, used to initialize pages.
// It includes global styles and the CustomToast component for notifications.

import '../styles/globals.css';
import CustomToast from '../components/CustomToast';
import { ThemeProvider } from '../components/ThemeProvider';
import React from 'react';

/**
 * Custom App component for Next.js.
 * @param {Object} props - The component props.
 * @param {React.Component} props.Component - The component to render.
 * @param {Object} props.pageProps - The props to pass to the component.
 * @returns {JSX.Element} The rendered component with CustomToast and ThemeProvider.
 */
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
      <CustomToast />
    </ThemeProvider>
  );
}

export default MyApp;