import global_FontWeight_bold from '@patternfly/react-tokens/dist/js/global_FontWeight_bold';
import global_spacer_3xl from '@patternfly/react-tokens/dist/js/global_spacer_3xl';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import React from 'react';

export const styles = {
  dataListHeading: {
    fontWeight: global_FontWeight_bold.value as any,
  },
  groupByHeading: {
    marginBottom: global_spacer_lg.value,
  },
  tagLink: {
    marginLeft: global_spacer_sm.value,
  },
  tagsContainer: {
    marginRight: global_spacer_3xl.value,
    marginTop: global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };
