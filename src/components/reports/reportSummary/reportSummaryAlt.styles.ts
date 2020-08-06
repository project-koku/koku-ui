import { global_Color_200 } from '@patternfly/react-tokens/dist/esm/global_BackgroundColor_200';
import { global_FontSize_xs } from '@patternfly/react-tokens/dist/esm/global_FontSize_xs';
import { global_spacer_lg } from '@patternfly/react-tokens/dist/esm/global_spacer_lg';
import { global_spacer_md } from '@patternfly/react-tokens/dist/esm/global_spacer_md';
import React from 'react';

export const styles = {
  chartSkeleton: {
    height: '175px',
    marginBottom: global_spacer_md.value,
    marginTop: global_spacer_md.value,
  },
  container: {
    display: 'flex',
  },
  cost: {
    flexGrow: 1,
    minHeight: '470px',
    marginRight: global_spacer_md.value,
  },
  legendSkeleton: {
    marginTop: global_spacer_md.value,
  },
  reportSummary: {
    height: '100%',
  },
  subtitle: {
    display: 'inline-block',
    fontSize: global_FontSize_xs.value,
    color: global_Color_200.var,
    marginBottom: '0',
  },
  tops: {
    flexGrow: 1,
    marginTop: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };
