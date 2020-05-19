import {
  global_FontWeight_bold,
  global_spacer_3xl,
  global_spacer_md,
} from '@patternfly/react-tokens';
import React from 'react';

export const chartStyles = {
  chartHeight: 150,
  subTitle: {
    fontWeight: global_FontWeight_bold.value as any,
  },
};

export const styles = {
  chartSkeleton: {
    height: '125px',
    marginBottom: global_spacer_md.value,
    marginTop: global_spacer_3xl.value,
  },
} as { [className: string]: React.CSSProperties };
