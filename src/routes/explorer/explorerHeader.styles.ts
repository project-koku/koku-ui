import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_Color_100 from '@patternfly/react-tokens/dist/js/global_Color_100';
import global_Color_200 from '@patternfly/react-tokens/dist/js/global_Color_200';
import global_FontSize_sm from '@patternfly/react-tokens/dist/js/global_FontSize_sm';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import type React from 'react';

export const styles = {
  cost: {
    display: 'flex',
    alignItems: 'center',
  },
  costValue: {
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'right',
  },
  costLabelUnit: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_100.var,
  },
  costLabelDate: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_200.var,
  },
  dateTitle: {
    textAlign: 'end',
  },
  filterContainer: {
    alignItems: 'unset',
  },
  header: {
    backgroundColor: global_BackgroundColor_light_100.var,
    paddingBottom: global_spacer_md.var,
    paddingLeft: global_spacer_lg.var,
    paddingRight: global_spacer_lg.var,
    paddingTop: global_spacer_lg.var,
  },
  headerContent: {
    alignItems: 'unset',
    minHeight: '36px',
  },
  headerContentRight: {
    display: 'flex',
  },
  perspectiveContainer: {
    alignItems: 'unset',
    paddingTop: global_spacer_md.var,
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
