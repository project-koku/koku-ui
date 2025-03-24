import { chart_color_blue_100 } from '@patternfly/react-tokens/dist/js/chart_color_blue_100';
import { chart_color_blue_200 } from '@patternfly/react-tokens/dist/js/chart_color_blue_200';
import { chart_color_blue_300 } from '@patternfly/react-tokens/dist/js/chart_color_blue_300';
import { chart_color_blue_400 } from '@patternfly/react-tokens/dist/js/chart_color_blue_400';
import { chart_color_blue_500 } from '@patternfly/react-tokens/dist/js/chart_color_blue_500';
import { chart_color_green_100 } from '@patternfly/react-tokens/dist/js/chart_color_green_100';
import { chart_color_green_200 } from '@patternfly/react-tokens/dist/js/chart_color_green_200';
import { chart_color_green_300 } from '@patternfly/react-tokens/dist/js/chart_color_green_300';
import { chart_color_green_400 } from '@patternfly/react-tokens/dist/js/chart_color_green_400';
import { chart_color_green_500 } from '@patternfly/react-tokens/dist/js/chart_color_green_500';
import { t_global_spacer_lg } from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import { t_global_spacer_sm } from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const chartStyles = {
  currentCapacityData: {
    fill: 'none',
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  currentColorScale: [
    chart_color_green_400.value,
    chart_color_green_300.value,
    chart_color_green_200.value,
    chart_color_green_100.value,
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
    marginTop: t_global_spacer_sm.value,
  },
  title: {
    marginLeft: '-' + t_global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };
