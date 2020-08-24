import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_Color_100 from '@patternfly/react-tokens/dist/js/global_Color_100';
import global_Color_200 from '@patternfly/react-tokens/dist/js/global_Color_200';
import global_FontSize_sm from '@patternfly/react-tokens/dist/js/global_FontSize_sm';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import global_spacer_xl from '@patternfly/react-tokens/dist/js/global_spacer_xl';
import React from 'react';

export const styles = {
  cost: {
    display: 'flex',
    alignItems: 'center',
  },
  costLabel: {},
  costValue: {
    marginTop: 0,
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
  costLabelUnit: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_100.var,
  },
  costLabelDate: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_200.var,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: global_spacer_xl.var,
    backgroundColor: global_BackgroundColor_light_100.var,
  },
  nav: {
    marginBottom: global_spacer_xl.var,
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
