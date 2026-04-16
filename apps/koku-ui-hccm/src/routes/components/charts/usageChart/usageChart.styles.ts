import chart_color_black_200 from '@patternfly/react-tokens/dist/js/chart_color_black_200';
import chart_color_green_100 from '@patternfly/react-tokens/dist/js/chart_color_green_100';
import chart_color_green_200 from '@patternfly/react-tokens/dist/js/chart_color_green_200';
import chart_color_green_300 from '@patternfly/react-tokens/dist/js/chart_color_green_300';
import chart_color_green_400 from '@patternfly/react-tokens/dist/js/chart_color_green_400';
import chart_color_green_500 from '@patternfly/react-tokens/dist/js/chart_color_green_500';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';

export const chartStyles = {
  chartContainer: {
    marginTop: t_global_spacer_lg.value,
  },
  currentRequestData: {
    data: {
      fill: 'none',
      stroke: chart_color_green_300.var,
      strokeDasharray: '3,3',
    },
  },
  currentUsageData: {
    data: {
      fill: 'none',
      stroke: chart_color_green_400.var,
    },
  },
  itemsPerRow: 2,
  // See: https://github.com/project-koku/koku-ui/issues/241
  legendColorScale: [
    chart_color_black_200.var,
    chart_color_green_400.var,
    chart_color_black_200.var,
    chart_color_green_300.var,
  ],
  previousRequestData: {
    data: {
      fill: 'none',
      stroke: chart_color_black_200.var,
      strokeDasharray: '3,3',
    },
  },
  previousUsageData: {
    data: {
      fill: 'none',
      stroke: chart_color_black_200.var,
    },
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  currentColorScale: [
    chart_color_green_400.var,
    chart_color_green_300.var,
    chart_color_green_200.var,
    chart_color_green_100.var,
    chart_color_green_500.var,
  ],
  // TBD: No grey scale, yet
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
