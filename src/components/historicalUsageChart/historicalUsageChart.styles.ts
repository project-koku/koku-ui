import { StyleSheet } from '@patternfly/react-styles';
import {
  global_FontFamily_sans_serif,
  global_FontSize_md,
  global_spacer_lg,
  global_spacer_sm,
  global_spacer_xl,
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
      fontSize: 14,
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
    display: 'inline-block',
    marginTop: global_spacer_lg.value,
    width: '60%',
  },
  chartContainer: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
  legend: {
    display: 'inline-block',
    fontSize: global_FontSize_md.value,
    paddingLeft: global_spacer_xl.value,
    width: '40%',
  },
  title: {
    paddingLeft: global_spacer_sm.value,
  },
});
