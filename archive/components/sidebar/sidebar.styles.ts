import React from 'react';
import { theme } from 'styles/theme';

export const styles = {
  sidebar: {
    position: 'fixed',
    top: theme.page_masthead_height,
    bottom: 0,
    left: 0,
    width: theme.page_sidebar_width,
    backgroundColor: theme.page_sidebar_background,
    transform: 'translateX(-110%)',
    transition: 'transform ease-in-out 200ms',
    boxShadow: theme.page_sidebar_boxShadow,
    [theme.page_breakpoint]: {
      transform: 'translateX(0)',
    },
  },
  sidebarOpen: {
    transform: 'translateX(0)',
  },
  mask: {
    [theme.page_breakpoint]: {
      display: 'none',
    },
  },
} as { [className: string]: React.CSSProperties };
