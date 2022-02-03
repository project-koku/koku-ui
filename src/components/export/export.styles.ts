import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import React from 'react';

export const styles = {
  exportIcon: {
    marginLeft: global_spacer_md.value,
    marginRight: global_spacer_sm.value,
  },
  exportLink: {
    display: 'flex',
    alignItems: 'center',
  },
} as { [className: string]: React.CSSProperties };
