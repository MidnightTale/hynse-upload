// @perama: This file is the custom App component for Next.js, used to initialize pages.
// It includes global styles and the CustomToast component for notifications.

import '../styles/globals.css';
import CustomToast from '../components/CustomToast';

/**
 * Custom App component for Next.js.
 * @param {Object} props - The component props.
 * @param {React.Component} props.Component - The component to render.
 * @param {Object} props.pageProps - The props to pass to the component.
 * @returns {JSX.Element} The rendered component with CustomToast.
 */
function MyApp({ Component, pageProps }) {
  // * Highlight: Wrap the Component with CustomToast for global notification handling
  return (
    <>
      <Component {...pageProps} />
      <CustomToast />
    </>
  );
}

// ! Alert: Ensure that CustomToast is properly configured in the project
// TODO: Consider adding error boundary and/or loading indicator at this level
// @param Component: The top-level component for the current page
// @param pageProps: The initial props for the page, can be extended with custom data

export default MyApp;