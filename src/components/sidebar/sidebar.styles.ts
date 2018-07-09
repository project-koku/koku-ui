import { StyleSheet } from '@patternfly/react-styles';
import { theme } from 'styles/theme';

export const styles = StyleSheet.create({
  sidebar: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    width: '80vw',
    backgroundColor: theme.page_sidebar_background,
    transform: 'translateX(-110%)',
    transition: 'transform ease-in-out 200ms',
    boxShadow: theme.page_sidebar_boxShadow,
    [theme.page_breakpoint]: {
      top: theme.page_masthead_height,
      width: theme.page_sidebar_width,
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
});
