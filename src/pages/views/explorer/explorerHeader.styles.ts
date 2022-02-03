import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_Color_100 from '@patternfly/react-tokens/dist/js/global_Color_100';
import global_Color_200 from '@patternfly/react-tokens/dist/js/global_Color_200';
import global_FontSize_sm from '@patternfly/react-tokens/dist/js/global_FontSize_sm';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
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
  costType: {
    display: 'flex',
    marginLeft: global_spacer_md.var,
  },
  groupBy: {
    paddingLeft: global_spacer_lg.var,
  },
  header: {
    backgroundColor: global_BackgroundColor_light_100.var,
    paddingBottom: global_spacer_sm.var,
    paddingLeft: global_spacer_lg.var,
    paddingRight: global_spacer_lg.var,
    paddingTop: global_spacer_lg.var,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerContentRight: {
    display: 'flex',
  },
  perspectiveContainer: {
    display: 'flex',
    marginTop: global_spacer_md.var,
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
