import {
  chart_color_blue_100,
  chart_color_blue_200,
  chart_color_blue_300,
  chart_color_blue_400,
  chart_color_blue_500,
  chart_color_green_100,
  chart_color_green_200,
  chart_color_green_300,
  chart_color_green_400,
  chart_color_green_500,
  global_FontFamily_sans_serif,
  global_spacer_lg,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import React from 'react';

export const chartStyles = {
  currentCapacityData: {
    fill: 'none',
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  currentColorScale: [
    chart_color_green_100.value,
    chart_color_green_200.value,
    chart_color_green_300.value,
    chart_color_green_400.value,
    chart_color_green_500.value,
  ],
  currentLimitData: {
    fill: 'none',
  },
  currentRequestData: {
    fill: 'none',
    strokeDasharray: '3,3',
  },
  currentUsageData: {
    fill: 'none',
  },
  itemsPerRow: 0,
  legend: {
    labels: {
      fontFamily: global_FontFamily_sans_serif.value,
      fontSize: 12,
    },
  },
  previousCapacityData: {
    fill: 'none',
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  previousColorScale: [
    chart_color_blue_100.value,
    chart_color_blue_200.value,
    chart_color_blue_300.value,
    chart_color_blue_400.value,
    chart_color_blue_500.value,
  ],
  previousLimitData: {
    fill: 'none',
  },
  previousRequestData: {
    fill: 'none',
    strokeDasharray: '3,3',
  },
  previousUsageData: {
    fill: 'none',
  },
  yAxis: {
    axisLabel: {
      padding: 15,
    },
    grid: {
      stroke: 'none',
    },
    ticks: {
      stroke: 'none',
    },
    tickLabels: {
      fontSize: 0,
    },
  },
  xAxis: {
    axisLabel: {
      padding: 40,
    },
    grid: {
      stroke: 'none',
    },
    ticks: {
      stroke: 'none',
    },
  },
};

export const styles = {
  chart: {
    marginTop: global_spacer_sm.value,
  },
  title: {
    marginLeft: '-' + global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };
