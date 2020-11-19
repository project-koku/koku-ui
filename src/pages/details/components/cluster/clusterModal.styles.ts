import global_spacer_2xl from '@patternfly/react-tokens/dist/js/global_spacer_2xl';
import React from 'react';

export const styles = {
  modal: {
    // Workaround for isLarge not working properly
    height: '700px',
    width: '600px',
  },
  subTitle: {
    marginTop: global_spacer_2xl.value,
    textAlign: 'right',
  },
} as { [className: string]: React.CSSProperties };
