import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
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
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

// Workaround for https://github.com/patternfly/patternfly-react/issues/4477
export const selectOverride = css`
  &.pf-c-select {
    min-width: 250px;
  }
`;
