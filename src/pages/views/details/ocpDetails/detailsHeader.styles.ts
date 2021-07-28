import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_Color_100 from '@patternfly/react-tokens/dist/js/global_Color_100';
import global_FontSize_md from '@patternfly/react-tokens/dist/js/global_FontSize_md';
import global_FontSize_sm from '@patternfly/react-tokens/dist/js/global_FontSize_sm';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import React from 'react';

export const styles = {
  costValue: {
    marginTop: 0,
    marginBottom: 0,
  },
  costLabelUnit: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_100.var,
  },
  dateTitle: {
    textAlign: 'end',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: global_spacer_lg.var,
    backgroundColor: global_BackgroundColor_light_100.var,
  },
  info: {
    verticalAlign: 'middle',
  },
  infoIcon: {
    fontSize: global_FontSize_md.value,
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
