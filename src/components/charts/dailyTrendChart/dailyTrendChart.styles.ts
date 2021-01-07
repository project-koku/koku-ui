import { chart_color_black_200 } from '@patternfly/react-tokens/dist/js/chart_color_black_200';
import { chart_color_green_100 } from '@patternfly/react-tokens/dist/js/chart_color_green_100';
import { chart_color_green_200 } from '@patternfly/react-tokens/dist/js/chart_color_green_200';
import { chart_color_green_300 } from '@patternfly/react-tokens/dist/js/chart_color_green_300';
import { chart_color_green_400 } from '@patternfly/react-tokens/dist/js/chart_color_green_400';
import { chart_color_green_500 } from '@patternfly/react-tokens/dist/js/chart_color_green_500';
import { chart_color_orange_300 } from '@patternfly/react-tokens/dist/js/chart_color_orange_300';

export const chartStyles = {
  // See: https://github.com/project-koku/koku-ui/issues/241
  currentColorScale: [
    chart_color_green_400.value,
    chart_color_green_300.value,
    chart_color_green_200.value,
    chart_color_green_100.value,
    chart_color_green_500.value,
  ],
  forecastConeDataColorScale: [chart_color_orange_300.value],
  forecastDataColorScale: [chart_color_green_200.value],
  itemsPerRow: 4,
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
