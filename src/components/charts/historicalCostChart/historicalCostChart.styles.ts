import { StyleSheet } from '@patternfly/react-styles';
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

export const chartStyles = {
  currentCapacityData: {
    data: {
      fill: 'none',
      stroke: '#519149',
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
  currentInfrastructureCostData: {
    data: {
      fill: 'none',
      stroke: '#88D080',
      strokeDasharray: '3,3',
    },
  },
  currentCostData: {
    data: {
      fill: 'none',
      stroke: '#A2DA9C',
    },
  },
  legend: {
    labels: {
      fontFamily: global_FontFamily_sans_serif.value,
      fontSize: 12,
    },
  },
  itemsPerRow: 0,
  previousCapacityData: {
    data: {
      fill: 'none',
      stroke: '#00659C',
    },
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  previousColorScale: [
    chart_color_blue_100.value,
    chart_color_blue_200.value,
    chart_color_blue_300.value,
    chart_color_blue_400.value,
    chart_color_blue_500.value,
  ],
  previousInfrastructureCostData: {
    data: {
      fill: 'none',
      stroke: '#39A5DC',
      strokeDasharray: '3,3',
    },
  },
  previousCostData: {
    data: {
      fill: 'none',
      stroke: '#7DC3E8',
    },
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

export const styles = StyleSheet.create({
  chart: {
    marginTop: global_spacer_sm.value,
  },
  chartContainer: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
  title: {
    marginLeft: '-' + global_spacer_lg.value,
  },
});
