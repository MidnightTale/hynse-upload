import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function getInitialColorMode() {
                const persistedColorPreference = window.localStorage.getItem('theme');
                const hasPersistedPreference = typeof persistedColorPreference === 'string';
                if (hasPersistedPreference) {
                  return persistedColorPreference;
                }
                const mql = window.matchMedia('(prefers-color-scheme: dark)');
                const hasMediaQueryPreference = typeof mql.matches === 'boolean';
                if (hasMediaQueryPreference) {
                  return mql.matches ? 'dark' : 'light';
                }
                return 'light';
              }
              const colorMode = getInitialColorMode();
              document.documentElement.classList.add(colorMode);
            })()
          `
        }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}