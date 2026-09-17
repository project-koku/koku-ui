import t_global_font_size_md from '@patternfly/react-tokens/dist/js/t_global_font_size_md';
import t_global_font_size_xl from '@patternfly/react-tokens/dist/js/t_global_font_size_xl';
import type React from 'react';

export const styles = {
  card: {
    minHeight: 330,
  },
  cardDescription: {
    fontSize: t_global_font_size_md.var,
  },
  cardBody: {
    fontSize: t_global_font_size_xl.var,
    textAlign: 'center',
  },
  _exampleMargin: {
    marginLeft: 30,
  },
  _inputField: {
    borderLeft: 0,
    width: 175,
  },
  _markupRadio: {
    marginBottom: 6,
  },
  _markupRadioContainer: {
    marginTop: 6,
  },
  _rateContainer: {
    marginLeft: 20,
  },
  _percent: {
    borderLeft: 0,
  },
  _sign: {
    borderRight: 0,
  },
} as { [className: string]: React.CSSProperties };
