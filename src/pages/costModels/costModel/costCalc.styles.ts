import global_FontSize_md from '@patternfly/react-tokens/dist/js/global_FontSize_md';
import global_FontSize_xl from '@patternfly/react-tokens/dist/js/global_FontSize_xl';
import React from 'react';

export const styles = {
  card: {
    minHeight: 250,
  },
  cardDescription: {
    fontSize: global_FontSize_md.value,
  },
  cardBody: {
    fontSize: global_FontSize_xl.value,
    textAlign: 'center',
  },
  radioAlign: {
    marginTop: 15,
  },
} as { [className: string]: React.CSSProperties };
