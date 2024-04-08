import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_FontSize_md from '@patternfly/react-tokens/dist/js/global_FontSize_md';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import global_spacer_xs from '@patternfly/react-tokens/dist/js/global_spacer_xs';
import type React from 'react';

export const styles = {
  costValue: {
    marginTop: global_spacer_lg.var,
    marginBottom: 0,
  },
  dateTitle: {
    textAlign: 'end',
  },
  exportContainer: {
    display: 'flex',
  },
  header: {
    backgroundColor: global_BackgroundColor_light_100.var,
    padding: global_spacer_lg.var,
  },
  perspective: {
    paddingTop: global_spacer_lg.var,
    marginTop: global_spacer_xs.var,
  },
  perspectiveContainer: {
    alignItems: 'unset',
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
