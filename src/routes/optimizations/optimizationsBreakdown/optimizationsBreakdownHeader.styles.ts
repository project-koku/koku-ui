import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_FontSize_md from '@patternfly/react-tokens/dist/js/global_FontSize_md';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import type React from 'react';

export const styles = {
  description: {
    marginTop: global_spacer_lg.var,
  },
  header: {
    backgroundColor: global_BackgroundColor_light_100.var,
    padding: global_spacer_lg.var,
  },
  infoIcon: {
    fontSize: global_FontSize_md.value,
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  title: {
    alignItems: 'center',
    display: 'flex',
    marginTop: global_spacer_md.var,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: global_spacer_lg.var,
  },
  warningIcon: {
    paddingLeft: global_spacer_sm.var,
    paddingTop: '2px',
  },
} as { [className: string]: React.CSSProperties };
