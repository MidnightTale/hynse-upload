import React, { useRef, forwardRef } from 'react';
import LoadingBar from 'react-top-loading-bar';

/**
 * The TopLoadingBar component displays a top-loading bar to indicate loading progress.
 */
const TopLoadingBar = forwardRef(({ color = 'var(--loading-bar-color)' }, ref) => {
  return (
    <LoadingBar
      color={color}
      ref={ref}
      height={1}
      className="glowing-loading-bar"
    />
  );
});

export default TopLoadingBar;