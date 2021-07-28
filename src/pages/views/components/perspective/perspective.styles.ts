import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import React from 'react';

export const styles = {
  perspectiveSelector: {
    display: 'flex',
    alignItems: 'center',
  },
  perspectiveLabel: {
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
  perspectiveOptionLabel: {
    marginBottom: 6,
    marginLeft: 8,
    marginTop: 6,
  },
} as { [className: string]: React.CSSProperties };
