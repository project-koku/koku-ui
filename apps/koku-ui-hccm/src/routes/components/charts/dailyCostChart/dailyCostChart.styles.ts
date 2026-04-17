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
import { chart_color_orange_300 } from '@patternfly/react-tokens/dist/js/chart_color_orange_300';

export const chartStyles = {
  // See: https://github.com/project-koku/koku-ui/issues/241
  currentColorScale: [
    chart_color_green_400.var,
    chart_color_green_300.var,
    chart_color_green_200.var,
    chart_color_green_100.var,
    chart_color_green_500.var,
  ],
  currentInfrastructureColorScale: [
    chart_color_blue_400.var,
    chart_color_blue_300.var,
    chart_color_blue_200.var,
    chart_color_blue_100.var,
    chart_color_blue_500.var,
  ],
  currentInfrastructureCostData: {
    strokeDasharray: '3,3',
  },
  forecastConeDataColorScale: [chart_color_orange_300.var],
  forecastDataColorScale: [chart_color_green_200.var],
  forecastInfrastructureConeDataColorScale: [chart_color_orange_300.var],
  forecastInfrastructureDataColorScale: [chart_color_blue_200.var],
  previousInfrastructureCostData: {
    strokeDasharray: '3,3',
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  previousColorScale: [chart_color_black_200.var, chart_color_black_200.var],
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
