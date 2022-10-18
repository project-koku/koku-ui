import global_spacer_xl from '@patternfly/react-tokens/dist/js/global_spacer_xl';
import React from 'react';

export const styles = {
  mainContent: {
    marginTop: global_spacer_xl.value,
  },
  subTitle: {
    textAlign: 'right',
  },
} as { [className: string]: React.CSSProperties };
