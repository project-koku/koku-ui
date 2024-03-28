import global_BackgroundColor_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_100';
import global_disabled_color_100 from '@patternfly/react-tokens/dist/js/global_disabled_color_100';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import global_spacer_xs from '@patternfly/react-tokens/dist/js/global_spacer_xs';
import type React from 'react';

export const styles = {
  clusterInfoContainer: {
    marginLeft: '-17px',
  },
  costDistribution: {
    marginTop: global_spacer_md.var,
    paddingBottom: global_spacer_md.var,
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
    paddingBottom: global_spacer_md.var,
  },
  description: {
    color: global_disabled_color_100.value,
    fontSize: global_FontSize_xs.value,
  },
  descriptionContainer: {
    alignItems: 'unset',
    paddingBottom: global_spacer_sm.var,
    paddingLeft: '1px',
  },
  header: {
    backgroundColor: global_BackgroundColor_100.var,
    paddingLeft: global_spacer_lg.var,
    paddingRight: global_spacer_lg.var,
    paddingTop: global_spacer_lg.var,
  },
  headerContent: {
    alignItems: 'unset',
    minHeight: '36px',
  },
  tabs: {
    display: 'flex',
  },
  tag: {
    marginLeft: global_spacer_lg.var,
  },
  title: {
    paddingTop: global_spacer_xs.var,
  },
} as { [className: string]: React.CSSProperties };
