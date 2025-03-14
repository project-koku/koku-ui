import global_spacer_3xl from '@patternfly/react-tokens/dist/js/global_spacer_3xl';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import type React from 'react';

export const styles = {
  tagLink: {
    marginLeft: global_spacer_sm.value,
  },
  tagsContainer: {
    marginRight: global_spacer_3xl.value,
    marginTop: global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };
