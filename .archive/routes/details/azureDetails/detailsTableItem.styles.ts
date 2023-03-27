import { global_spacer_3xl, global_spacer_xl } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  clusterContainer: {
    marginBottom: global_spacer_xl.value,
  },
  historicalContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: global_spacer_xl.value,
  },
  leftPane: {
    marginRight: global_spacer_3xl.value,
    paddingBottom: global_spacer_xl.value,
    paddingRight: global_spacer_3xl.value,
  },
  rightPane: {
    marginRight: global_spacer_xl.value,
    paddingBottom: global_spacer_xl.value,
  },
  tagsContainer: {
    marginBottom: global_spacer_xl.value,
  },
} as { [className: string]: React.CSSProperties };
