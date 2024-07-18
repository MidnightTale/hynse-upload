// @perama: This file is the custom App component for Next.js, used to initialize pages.
// It includes global styles, the CustomToast component for notifications, and the TopLoadingBar component for loading feedback.

import '../styles/globals.css';
import CustomToast from '../components/notifications/CustomToast';
import { ThemeProvider } from '../components/common/ThemeProvider';
import React from 'react';
import TopLoadingBar from '../components/common/TopLoadingBar';
import { useEffect } from 'react';
import { requestSessionKey } from '../components/utils/sessionUtil';

/**
 * Custom App component for Next.js.
 * @param {Object} props - The component props.
 * @param {React.Component} props.Component - The component to render.
 * @param {Object} props.pageProps - The props to pass to the component.
 * @returns {JSX.Element} The rendered component with CustomToast, ThemeProvider, and TopLoadingBar.
 */
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const initializeSession = async () => {
      try {
        await requestSessionKey();
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };

    initializeSession();
  }, []);

  return (
    <ThemeProvider>
      <TopLoadingBar />
      <Component {...pageProps} />
      <CustomToast />
    </ThemeProvider>
  );
}

export default MyApp;