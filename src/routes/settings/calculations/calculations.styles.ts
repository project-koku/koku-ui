import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import type React from 'react';

export const styles = {
  actionsContainer: {
    backgroundColor: global_BackgroundColor_light_100.var,
    paddingBottom: global_spacer_lg.var,
    paddingLeft: global_spacer_lg.var,
    paddingRight: global_spacer_lg.var,
    // paddingTop: global_spacer_lg.var,
  },
  costType: {
    marginBottom: global_spacer_lg.var,
    marginTop: global_spacer_lg.var,
    width: 'fit-content',
  },
  costTypeContainer: {
    backgroundColor: global_BackgroundColor_light_100.var,
    paddingBottom: global_spacer_lg.var,
    paddingLeft: global_spacer_lg.var,
    paddingRight: global_spacer_lg.var,
    paddingTop: global_spacer_lg.var,
  },
  currency: {
    marginTop: global_spacer_lg.var,
    width: 'fit-content',
  },
  currencyContainer: {
    backgroundColor: global_BackgroundColor_light_100.var,
    paddingBottom: global_spacer_lg.var,
    paddingLeft: global_spacer_lg.var,
    paddingRight: global_spacer_lg.var,
    paddingTop: global_spacer_lg.var,
  },
  resetContainer: {
    display: 'inline-block',
    paddingLeft: global_spacer_md.var,
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
