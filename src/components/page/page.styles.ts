import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_300,
  global_breakpoint_md,
} from '@patternfly/react-tokens';
import { theme } from 'styles/theme';

const breakpoint = `@media (min-width: ${global_breakpoint_md.value})`;

export const styles = StyleSheet.create({
  body: {
    backgroundColor: global_BackgroundColor_300.value,
  },
  noScroll: {
    overflow: 'hidden',
    [breakpoint]: {
      overflow: 'initial',
    },
  },
  main: {
    marginTop: theme.page_masthead_height,
    [breakpoint]: {
      marginLeft: theme.page_sidebar_width,
    },
  },
});
