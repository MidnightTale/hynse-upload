// This file is the custom App component for Next.js, used to initialize pages.
// It includes global styles.

import '../styles/globals.css';

/**
 * Custom App component for Next.js.
 * @param {Object} props - The component props.
 * @param {React.Component} props.Component - The component to render.
 * @param {Object} props.pageProps - The props to pass to the component.
 * @returns {JSX.Element} The rendered component.
 */
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;