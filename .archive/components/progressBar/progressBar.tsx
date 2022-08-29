import './progressBar.scss';

import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.SFC<ProgressBarProps> = ({ progress }) => {
  const width = Math.min(Math.max(0, progress), 100); // force between 0 - 100;
  return (
    <div className="progressBar">
      <div className={['bar', { width: `${width}%` }].join('')} />
    </div>
  );
};

export { ProgressBar, ProgressBarProps };
