import global_BackgroundColor_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_100';
import global_disabled_color_100 from '@patternfly/react-tokens/dist/js/global_disabled_color_100';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_xl from '@patternfly/react-tokens/dist/js/global_spacer_xl';
import global_spacer_xs from '@patternfly/react-tokens/dist/js/global_spacer_xs';
import type React from 'react';

export const styles = {
  cost: {
    marginTop: global_spacer_xl.var,
  },
  costDistribution: {
    marginTop: global_spacer_md.var,
  },
  costLabel: {
    marginTop: global_spacer_xs.var,
  },
  costValue: {
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'right',
  },
  costLabelDate: {
    textAlign: 'right',
  },
  costType: {
    marginTop: global_spacer_md.var,
  },
  description: {
    color: global_disabled_color_100.value,
    fontSize: global_FontSize_xs.value,
    paddingLeft: '1px',
  },
  header: {
    backgroundColor: global_BackgroundColor_100.var,
    paddingLeft: global_spacer_lg.var,
    paddingRight: global_spacer_lg.var,
    paddingTop: global_spacer_lg.var,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '36px',
  },
  headerContentRight: {
    display: 'flex',
  },
  tabs: {
    display: 'flex',
  },
  tag: {
    marginLeft: global_spacer_lg.var,
  },
  title: {
    paddingBottom: global_spacer_lg.var,
    paddingTop: global_spacer_xs.var,
  },
} as { [className: string]: React.CSSProperties };
