import chart_color_green_100 from '@patternfly/react-tokens/dist/js/chart_color_green_100';
import chart_color_green_200 from '@patternfly/react-tokens/dist/js/chart_color_green_200';
import chart_color_green_300 from '@patternfly/react-tokens/dist/js/chart_color_green_300';
import chart_color_green_400 from '@patternfly/react-tokens/dist/js/chart_color_green_400';
import chart_color_green_500 from '@patternfly/react-tokens/dist/js/chart_color_green_500';
import global_disabled_color_200 from '@patternfly/react-tokens/dist/js/global_disabled_color_200';

export const chartStyles = {
  // See: https://github.com/project-koku/koku-ui/issues/241
  currentColorScale: [
    chart_color_green_400.value,
    chart_color_green_300.value,
    chart_color_green_200.value,
    chart_color_green_100.value,
    chart_color_green_500.value,
  ],
  currentMonthData: {
    fill: 'none',
  },
  forecastColorScale: [chart_color_green_200.value],
  forecastConeColorScale: [chart_color_green_100.value],
  forecastData: {
    fill: 'none',
  },
  forecastConeData: {
    fill: chart_color_green_100.value,
    strokeWidth: 0,
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  previousColorScale: [global_disabled_color_200.value, global_disabled_color_200.value],
  previousMonthData: {
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
