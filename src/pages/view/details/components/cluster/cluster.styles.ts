import global_spacer_3xl from '@patternfly/react-tokens/dist/js/global_spacer_3xl';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import React from 'react';

export const styles = {
  clustersContainer: {
    marginRight: global_spacer_3xl.value,
    marginTop: global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };
