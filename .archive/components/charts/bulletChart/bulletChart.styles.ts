import {
  chart_color_black_100,
  chart_color_black_200,
  chart_color_black_300,
  chart_color_black_400,
  chart_color_black_500,
  chart_color_blue_100,
  chart_color_blue_200,
  chart_color_blue_300,
  chart_color_blue_400,
  chart_color_blue_500,
  global_danger_color_100,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import React from 'react';

export const chartStyles = {
  height: 55,
  itemsPerRow: 2,
  legendHeight: 30,
  // See: https://github.com/project-koku/koku-ui/issues/241
  rangeColorScale: [
    chart_color_black_100.value,
    chart_color_black_200.value,
    chart_color_black_300.value,
    chart_color_black_400.value,
    chart_color_black_500.value,
  ],
  rangeWidth: 40,
  thresholdErrorColor: global_danger_color_100.value,
  thresholdErrorWidth: 2,
  // See: https://github.com/project-koku/koku-ui/issues/241
  valueColorScale: [
    chart_color_blue_100.value,
    chart_color_blue_200.value,
    chart_color_blue_300.value,
    chart_color_blue_400.value,
    chart_color_blue_500.value,
  ],
  valueWidth: 9,
};

export const styles = {
  bulletChart: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
  bulletChartLegend: {
    marginTop: global_spacer_md.value,
  },
  bulletChartTitle: {
    paddingBottom: global_spacer_md.value,
    paddingLeft: global_spacer_sm.value,
  },
} as { [className: string]: React.CSSProperties };
