// @perama: This component renders the donation section with a Ko-Fi iframe.
// It provides a way for users to support server costs through Ko-Fi donations.

import React from 'react';

/**
 * The DonationSection component displays a Ko-Fi donation iframe.
 * @returns {JSX.Element} A div containing a paragraph and an iframe for Ko-Fi donations.
 */
const DonationSection = () => {
  return (
    <div className="bg-app-background p-4 rounded-lg text-center text-text-color">
      {/* * Highlight: This paragraph contains a link to the Ko-Fi donation page */}
      <p className="text-2xl mb-2">
        Support server costs with{' '}
        <a
          href="https://ko-fi.com/midnighttale"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-color font-bold hover:underline"
        >
          Ko-Fi
        </a>
      </p>
      
      {/* * Highlight: This iframe embeds the Ko-Fi donation widget */}
      <iframe
        src="https://ko-fi.com/streamalerts/goaloverlay/sa_bd9a46e4-66c2-4ec2-9726-dbcc2c2ec84e"
        width="100%"
        height="100"
        style={{ border: 'none' }}
      ></iframe>
      
      {/* ! Alert: Ensure that the Ko-Fi stream alerts URL is always up-to-date */}
      {/* TODO: Implement error handling for iframe loading failures */}
      {/* @param src: The source URL for the Ko-Fi stream alerts iframe */}
    </div>
  );
};

export default DonationSection;