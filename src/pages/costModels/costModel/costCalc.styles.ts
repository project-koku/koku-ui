import global_FontSize_xl from '@patternfly/react-tokens/dist/js/global_FontSize_xl';
import global_FontSize_md from '@patternfly/react-tokens/dist/js/global_FontSize_md';
import React from 'react';

export const styles = {
  card: {
    minHeight: '150px',
  },
  cardDescription: {
    fontSize: global_FontSize_md.value,
  },
  cardBody: {
    fontSize: global_FontSize_xl.value,
    textAlign: 'center',
  },
} as { [className: string]: React.CSSProperties };
