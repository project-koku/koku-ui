import { global_FontWeight_bold, global_spacer_3xl, global_spacer_lg, global_spacer_sm } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  dataListHeading: {
    fontWeight: global_FontWeight_bold.value as any
  },
  groupByHeading: {
    marginBottom: global_spacer_lg.value
  },
  tagLink: {
    marginLeft: global_spacer_sm.value,
  },
  tagsContainer: {
    marginRight: global_spacer_3xl.value,
    marginTop: global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };
