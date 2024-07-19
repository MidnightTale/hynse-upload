import React from 'react';
import LoadingBar from 'react-top-loading-bar';

const TopLoadingBar = ({ progress }) => {
  return (
    <LoadingBar
      color="#e487ff"
      progress={progress}
      onLoaderFinished={() => {}}
      height={3}
    />
  );
};

export default TopLoadingBar;