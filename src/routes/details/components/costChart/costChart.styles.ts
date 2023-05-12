import global_FontWeight_bold from '@patternfly/react-tokens/dist/js/global_FontWeight_bold';
import global_spacer_3xl from '@patternfly/react-tokens/dist/js/global_spacer_3xl';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import type React from 'react';

export const chartStyles = {
  chartHeight: 150,
  chartWidth: 475,
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
