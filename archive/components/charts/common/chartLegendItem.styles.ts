import global_BorderWidth_sm from '@patternfly/react-tokens/dist/js/global_BorderWidth_sm';
import global_Color_200 from '@patternfly/react-tokens/dist/js/global_Color_200';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import React from 'react';

import { chartStyles } from './chart.styles';

export const styles = {
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: global_FontSize_xs.value,
    color: global_Color_200.var,
    marginRight: global_spacer_md.value,
  },
  color: {
    height: 10,
    width: 10,
    marginRight: global_spacer_sm.value,
    borderWidth: global_BorderWidth_sm.value,
    borderStyle: 'solid',
  },
  currentColor: {
    backgroundColor: chartStyles.currentMonth.data.fill,
    borderColor: chartStyles.currentMonth.data.stroke,
  },
  previousColor: {
    backgroundColor: chartStyles.previousMonth.data.fill,
    borderColor: chartStyles.previousMonth.data.stroke,
  },
} as { [className: string]: React.CSSProperties };
