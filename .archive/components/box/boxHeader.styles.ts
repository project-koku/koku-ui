import React from 'react';

export const styles = {
  boxHeader: {
    flex: '0 0 auto',
    paddingTop: '2rem',
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
