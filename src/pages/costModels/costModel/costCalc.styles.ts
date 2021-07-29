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
  sign: {
    borderRight: 0,
  },
  percent: {
    borderLeft: 0,
  },
  exampleMargin: {
    marginLeft: 30,
  },
  rateWidth: {
    width: 150,
  },
} as { [className: string]: React.CSSProperties };
