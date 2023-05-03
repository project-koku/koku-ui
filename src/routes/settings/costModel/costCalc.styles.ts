import global_FontSize_md from '@patternfly/react-tokens/dist/js/global_FontSize_md';
import global_FontSize_xl from '@patternfly/react-tokens/dist/js/global_FontSize_xl';
import type React from 'react';

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
  exampleMargin: {
    marginLeft: 30,
  },
  inputField: {
    borderLeft: 0,
    width: 175,
  },
  markupRadio: {
    marginBottom: 6,
  },
  markupRadioContainer: {
    marginTop: 6,
  },
  rateContainer: {
    marginLeft: 20,
  },
  percent: {
    borderLeft: 0,
  },
  sign: {
    borderRight: 0,
  },
} as { [className: string]: React.CSSProperties };
