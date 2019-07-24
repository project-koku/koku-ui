import { StyleSheet } from '@patternfly/react-styles';
import {
  global_FontFamily_sans_serif,
  global_spacer_2xl,
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
  currentColorScale: ['#A2DA9C', '#88D080', '#6EC664', '#519149', '#3C6C37'],
  currentLimitData: {
    data: {
      fill: 'none',
      stroke: '#6EC664',
    },
  },
  currentRequestData: {
    data: {
      fill: 'none',
      stroke: '#88D080',
      strokeDasharray: '3,3',
    },
  },
  currentUsageData: {
    data: {
      fill: 'none',
      stroke: '#A2DA9C',
    },
  },
  itemsPerRow: 0,
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
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  previousColorScale: ['#7DC3E8', '#39A5DC', '#007BBA', '#00659C', '#004D76'],
  previousLimitData: {
    data: {
      fill: 'none',
      stroke: '#007BBA',
    },
  },
  previousRequestData: {
    data: {
      fill: 'none',
      stroke: '#39A5DC',
      strokeDasharray: '3,3',
    },
  },
  previousUsageData: {
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
  legendContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  legend: {
    paddingTop: global_spacer_2xl.value,
    marginLeft: '-175px;',
  },
  legendWrap: {
    paddingTop: global_spacer_2xl.value,
    marginLeft: '225px;',
    height: '125px',
  },
  title: {
    marginLeft: '-' + global_spacer_lg.value,
  },
});
