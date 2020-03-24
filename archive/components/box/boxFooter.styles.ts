import React from 'react';

export const styles = {
  boxFooter: {
    flex: '0 0 auto',
    paddingTop: '1rem',
    paddingRight: '2rem',
    paddingBottom: '1rem',
    paddingLeft: '2rem',
    ':last-child': {
      paddingBottom: '2rem',
    },
  },
} as { [className: string]: React.CSSProperties };
