import React from 'react';

export const styles = {
  boxBody: {
    flex: '1 1 auto',
    paddingTop: '1rem',
    paddingRight: '2rem',
    paddingBottom: '1rem',
    paddingLeft: '2rem',
    ':first-child': {
      paddingTop: '2rem',
    },
    ':last-child': {
      paddingBottom: '2rem',
    },
  },
} as { [className: string]: React.CSSProperties };
