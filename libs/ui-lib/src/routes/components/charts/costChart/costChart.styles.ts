import { chart_color_black_200 } from '@patternfly/react-tokens/dist/js/chart_color_black_200';
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

export const chartStyles = {
  // See: https://github.com/project-koku/koku-ui/issues/241
  currentColorScale: [
    chart_color_green_400.value,
    chart_color_green_300.value,
    chart_color_green_200.value,
    chart_color_green_100.value,
    chart_color_green_500.value,
  ],
  currentCostData: {
    fill: 'none',
  },
  currentInfrastructureColorScale: [
    chart_color_blue_400.value,
    chart_color_blue_300.value,
    chart_color_blue_200.value,
    chart_color_blue_100.value,
    chart_color_blue_500.value,
  ],
  currentInfrastructureCostData: {
    fill: 'none',
    strokeDasharray: '3,3',
  },
  forecastConeData: {
    fill: chart_color_green_100.value,
    strokeWidth: 0,
  },
  forecastConeDataColorScale: [chart_color_green_100.value],
  forecastData: {
    fill: 'none',
  },
  forecastDataColorScale: [chart_color_green_200.value],
  forecastInfrastructureConeData: {
    fill: chart_color_blue_100.value,
    strokeWidth: 0,
  },
  forecastInfrastructureConeDataColorScale: [chart_color_blue_100.value],
  forecastInfrastructureData: {
    fill: 'none',
  },
  forecastInfrastructureDataColorScale: [chart_color_blue_200.value],
  previousCostData: {
    fill: 'none',
  },
  previousInfrastructureCostData: {
    fill: 'none',
    strokeDasharray: '3,3',
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  previousColorScale: [chart_color_black_200.value, chart_color_black_200.value],
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
