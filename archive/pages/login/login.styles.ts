import {
  global_BackgroundColor_dark_100,
  global_spacer_2xl,
  global_spacer_md,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  alert: {
    marginBottom: global_spacer_md.value,
  },
  body: {
    backgroundColor: global_BackgroundColor_dark_100.value,
    minHeight: '100vh',
  },
  loginPage: {
    height: '100vh',
    flex: 1,
  },
  loginBox: {
    padding: global_spacer_2xl.value,
  },
} as { [className: string]: React.CSSProperties };
