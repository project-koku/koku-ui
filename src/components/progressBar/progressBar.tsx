import React from 'react';
import { styles } from './progressBar.styles';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.SFC<ProgressBarProps> = ({ progress }) => {
  const width = Math.min(Math.max(0, progress), 100); // force between 0 - 100;
  return (
    <div style={styles.progressBar}>
      <div style={{ ...styles.bar, width: `${width}%` }} />
    </div>
  );
};

export { ProgressBar, ProgressBarProps };
