import {
  global_BackgroundColor_200,
  global_breakpoint_md,
} from '@patternfly/react-tokens';
import React from 'react';
import { theme } from 'styles/theme';

const breakpoint = `@media (min-width: ${global_breakpoint_md.value})`;

export const styles = {
  body: {
    backgroundColor: global_BackgroundColor_200.value,
  },
  noScroll: {
    overflow: 'hidden',
    [breakpoint]: {
      overflow: 'initial',
    },
  },
  main: {
    minHeight: '100%',
    flexGrow: 1,
    marginTop: theme.page_masthead_height,
    [breakpoint]: {
      marginLeft: theme.page_sidebar_width,
    },
  },
} as { [className: string]: React.CSSProperties };
