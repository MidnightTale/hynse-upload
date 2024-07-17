import React from 'react';

/**
 * The RibbonAnnouncement component displays a sticky ribbon at the top of the page.
 */
const RibbonAnnouncement = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[var(--ribbon-background)] text-[var(--ribbon-text-color)] text-center py-2 z-50 backdrop-blur-md bg-opacity-80">
      This site is a Work in Progress (WIP)
    </div>
  );
};

export default RibbonAnnouncement;