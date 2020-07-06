import {
  global_BackgroundColor_light_100,
  global_spacer_md,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import { css } from 'emotion';
import React from 'react';

export const styles = {
  export: {
    marginRight: global_spacer_md.value,
  },
  toolbarContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
  },
} as { [className: string]: React.CSSProperties };

// Workaround for https://github.com/patternfly/patternfly-react/issues/4477
export const selectOverride = css`
  &.pf-c-select {
    min-width: 250px;
  }
`;
