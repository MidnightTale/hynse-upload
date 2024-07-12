// This component renders the donation section with a Ko-Fi iframe.

import React from 'react';

/**
 * The DonationSection component displays a Ko-Fi donation iframe.
 */
const DonationSection = () => {
  return (
    <div className="bg-app-background p-4 rounded-lg text-center text-text-color">
      <p className="text-2xl mb-2">Support server costs with <a href="https://ko-fi.com/midnighttale" target="_blank" rel="noopener noreferrer" className="text-primary-color font-bold hover:underline">Ko-Fi</a></p>
      <iframe src="https://ko-fi.com/streamalerts/goaloverlay/sa_bd9a46e4-66c2-4ec2-9726-dbcc2c2ec84e" width="100%" height="100" style={{ border: 'none' }}></iframe>
    </div>
  );
};

export default DonationSection;