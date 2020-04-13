import { global_spacer_2xl, global_spacer_xl } from '@patternfly/react-tokens';
import React from 'react';

export const chartStyles = {
  chartAltHeight: 180,
  chartHeight: 80,
  containerAltHeight: 200,
  containerTrendHeight: 150,
};

export const styles = {
  tabs: {
    marginTop: global_spacer_2xl.value,
  },
  tabItems: {
    marginTop: global_spacer_xl.value,
  },
} as { [className: string]: React.CSSProperties };
