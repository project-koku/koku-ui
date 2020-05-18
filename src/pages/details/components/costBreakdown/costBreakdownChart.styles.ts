import { global_spacer_3xl, global_spacer_md } from '@patternfly/react-tokens';
import React from 'react';

export const chartStyles = {
  chartHeight: 150,
};

export const styles = {
  chartSkeleton: {
    height: '125px',
    marginBottom: global_spacer_md.value,
    marginTop: global_spacer_3xl.value,
  },
} as { [className: string]: React.CSSProperties };
