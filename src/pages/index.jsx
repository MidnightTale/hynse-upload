// This is the main page of the Next.js application.
// It renders the FileUpload component and other UI elements for the file upload service.

import React, { useEffect, useState, useRef } from 'react';
import FileUpload from '../components/upload/FileUpload';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import UploadHistory from '../components/history/UploadHistory';
import CustomToast from '../components/notifications/CustomToast';
import Image from 'next/image';
import ShigureUi from "/public/img/shigure-ui.webp";
import { useTheme } from 'next-themes';
import RibbonAnnouncement from '../components/common/RibbonAnnouncement';
import TopLoadingBar from '../components/common/TopLoadingBar';
import { initiateHandshake } from '../components/utils/sessionUtil';

/**
 * The Home component is the main page of the Next.js application.
 * It renders the FileUpload component and other UI elements for the file upload service.
 */
export default function Home() {
  const { theme } = useTheme();
  const [showImage, setShowImage] = useState(false);
  const loadingBarRef = useRef(null);

  useEffect(() => {
    const initHandshake = async () => {
      try {
        await initiateHandshake();
      } catch (error) {
        console.error('Failed to initialize handshake:', error);
      }
    };

    initHandshake();

    if (theme === 'light') {
      setShowImage(Math.random() < 0.0001);
    } else {
      setShowImage(false);
    }
  }, [theme]);

  useEffect(() => {
    if (loadingBarRef.current) {
      // Start the loading bar
      loadingBarRef.current.continuousStart();

      // Simulate a loading process
      setTimeout(() => {
        // Complete the loading bar
        loadingBarRef.current.complete();
      }, 30);
    }
  }, []);

  return (
    <div className="bg-app-background text-text-color min-h-screen">
      <RibbonAnnouncement />
      <TopLoadingBar ref={loadingBarRef} color="var(--loading-bar-color)" />
      {showImage && (
        <div className="fixed inset-0">
          <Image
            src={ShigureUi}
            alt="ShigureUi"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
            priority
          />
        </div>
      )}
      <CustomToast />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <FileUpload />
      </main>
      <Footer />
    </div>
  );
}