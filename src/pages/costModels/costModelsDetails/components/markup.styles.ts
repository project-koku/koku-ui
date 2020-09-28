import global_FontSize_xl from '@patternfly/react-tokens/dist/js/global_FontSize_xl';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import React from 'react';

export const styles = {
  card: {
    minHeight: '130px',
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
  },
  cardBody: {
    fontSize: global_FontSize_xl.value,
    textAlign: 'center',
  },
} as { [className: string]: React.CSSProperties };
