import global_spacer_2xl from '@patternfly/react-tokens/dist/js/global_spacer_2xl';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_xl from '@patternfly/react-tokens/dist/js/global_spacer_xl';
import type React from 'react';

export const chartStyles = {
  chartAltHeight: 250,
  chartHeight: 180,
  containerAltHeight: 250,
  containerTrendHeight: 180,
  containerUsageHeight: 180,
};

export const styles = {
  comparison: {
    marginBottom: global_spacer_md.value,
  },
  comparisonContainer: {
    display: 'flex',
  },
  tabs: {
    marginTop: global_spacer_2xl.value,
  },
  tabItems: {
    marginTop: global_spacer_xl.value,
  },
} as { [className: string]: React.CSSProperties };
