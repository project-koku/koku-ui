import {
  chart_color_green_100,
  chart_color_green_200,
  chart_color_green_300,
  chart_color_green_400,
  chart_color_green_500,
  global_disabled_color_200,
  global_FontFamily_sans_serif,
} from '@patternfly/react-tokens';

export const chartStyles = {
  currentCostData: {
    data: {
      fill: 'none',
      stroke: '#A2DA9C',
    },
  },
  currentInfrastructureCostData: {
    data: {
      fill: 'none',
      stroke: '#88D080',
      strokeDasharray: '3,3',
    },
  },
  itemsPerRow: 2,
  legend: {
    labels: {
      fontFamily: global_FontFamily_sans_serif.value,
      fontSize: 14,
    },
    minWidth: 200,
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  legendColorScale: [
    global_disabled_color_200.value,
    chart_color_green_100.value,
    global_disabled_color_200.value,
    chart_color_green_200.value,
  ],
  previousCostData: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_200.value,
    },
  },
  previousInfrastructureCostData: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_200.value,
      strokeDasharray: '3,3',
    },
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  currentColorScale: [
    chart_color_green_100.value,
    chart_color_green_200.value,
    chart_color_green_300.value,
    chart_color_green_400.value,
    chart_color_green_500.value,
  ],
  previousColorScale: [
    global_disabled_color_200.value,
    global_disabled_color_200.value,
  ],
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
