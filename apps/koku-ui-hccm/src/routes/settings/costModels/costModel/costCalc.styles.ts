import t_global_font_size_md from '@patternfly/react-tokens/dist/js/t_global_font_size_md';
import t_global_font_size_xl from '@patternfly/react-tokens/dist/js/t_global_font_size_xl';
import type React from 'react';

export const styles = {
  card: {
    minHeight: 330,
  },
  cardDescription: {
    fontSize: t_global_font_size_md.value,
  },
  cardBody: {
    fontSize: t_global_font_size_xl.value,
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
