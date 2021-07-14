import global_FontSize_xl from '@patternfly/react-tokens/dist/js/global_FontSize_xl';
import React from 'react';

export const styles = {
  card: {
    minHeight: '130px',
  },
  cardBody: {
    fontSize: global_FontSize_xl.value,
    textAlign: 'center',
  },
} as { [className: string]: React.CSSProperties };
