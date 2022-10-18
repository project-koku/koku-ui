import {
  global_active_color_100,
  global_Color_dark_100,
  global_spacer_lg,
  global_spacer_md,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import { StyleDeclaration } from 'aphrodite';
import React from 'react';

const activeIdicator: StyleDeclaration = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '2rem',
  height: '0.25rem',
  content: '""',
  backgroundColor: global_active_color_100.value,
};

export const styles = {
  verticalNavLink: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: global_spacer_xl.value,
    paddingLeft: global_spacer_xl.value,
    color: global_Color_dark_100.value,
    textDecoration: 'none',
    backgroundColor: 'transparent',
    ':hover': {
      textDecoration: 'none',
    },
  },
  verticalNavLinkActive: {
    color: global_active_color_100.value,
  },
  text: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    paddingTop: global_spacer_lg.value,
    paddingBottom: global_spacer_lg.value,
    ':hover': {
      '::after': activeIdicator,
    },
  },
  icon: {
    marginRight: global_spacer_md.var,
  },
  textActive: {
    ':after': activeIdicator,
  },
} as { [className: string]: React.CSSProperties };
