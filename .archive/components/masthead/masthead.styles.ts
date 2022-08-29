import {
  global_Color_light_100,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import React from 'react';
import { theme } from 'styles/theme';

export const styles = {
  masthead: {
    height: theme.page_masthead_height,
    top: 0,
    left: 0,
    right: 0,
    position: 'fixed',
    backgroundColor: 'transparent',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: global_spacer_md.value,
    paddingRight: global_spacer_md.value,
    zIndex: 10,
  },
  scrolled: {
    backgroundColor: '#000',
  },
  navToggle: {
    color: global_Color_light_100.value,
    marginRight: global_spacer_sm.value,
    [theme.page_breakpoint]: {
      display: 'none',
    },
  },
  section: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    textTransform: 'capitalize',
    marginRight: global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };
