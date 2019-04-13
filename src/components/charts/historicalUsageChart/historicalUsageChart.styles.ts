import { StyleSheet } from '@patternfly/react-styles';
import {
  c_background_image_BackgroundColor,
  global_Color_light_200,
  global_FontFamily_sans_serif,
  global_spacer_2xl,
  global_spacer_lg,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import { VictoryStyleInterface } from 'victory';

export const chartStyles = {
  currentCapacityData: {
    data: {
      fill: 'none',
      stroke: '#519149',
    },
  } as VictoryStyleInterface,
  // See: https://github.com/project-koku/koku-ui/issues/241
  currentColorScale: ['#A2DA9C', '#88D080', '#6EC664', '#519149', '#3C6C37'],
  currentLimitData: {
    data: {
      fill: 'none',
      stroke: '#6EC664',
    },
  } as VictoryStyleInterface,
  currentRequestData: {
    data: {
      fill: 'none',
      stroke: '#88D080',
      strokeDasharray: '3,3',
    },
  } as VictoryStyleInterface,
  currentUsageData: {
    data: {
      fill: 'none',
      stroke: '#A2DA9C',
    },
  } as VictoryStyleInterface,
  legend: {
    labels: {
      fontFamily: global_FontFamily_sans_serif.value,
      fontSize: 12,
    },
  },
  previousCapacityData: {
    data: {
      fill: 'none',
      stroke: '#00659C',
    },
  } as VictoryStyleInterface,
  // See: https://github.com/project-koku/koku-ui/issues/241
  previousColorScale: ['#7DC3E8', '#39A5DC', '#007BBA', '#00659C', '#004D76'],
  previousLimitData: {
    data: {
      fill: 'none',
      stroke: '#007BBA',
    },
  } as VictoryStyleInterface,
  previousRequestData: {
    data: {
      fill: 'none',
      stroke: '#39A5DC',
      strokeDasharray: '3,3',
    },
  } as VictoryStyleInterface,
  previousUsageData: {
    data: {
      fill: 'none',
      stroke: '#7DC3E8',
    },
  } as VictoryStyleInterface,
  tooltip: {
    flyoutStyle: {
      fill: c_background_image_BackgroundColor.value,
      strokeWidth: 0,
    },
    style: {
      fill: global_Color_light_200.value,
      padding: 18,
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
  } as VictoryStyleInterface,
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
  } as VictoryStyleInterface,
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
  legendContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  legend: {
    paddingTop: global_spacer_2xl.value,
    marginLeft: '-175px;',
  },
  title: {
    marginLeft: '-' + global_spacer_lg.value,
  },
});
