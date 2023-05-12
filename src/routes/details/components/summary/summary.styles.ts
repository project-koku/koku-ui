import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_xl from '@patternfly/react-tokens/dist/js/global_spacer_xl';
import type React from 'react';

export const styles = {
  skeleton: {
    marginTop: global_spacer_md.value,
  },
  tabs: {
    marginTop: global_spacer_xl.value,
  },
  viewAllContainer: {
    marginLeft: '-18px',
    paddingTop: global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };
