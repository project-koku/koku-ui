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
  previousColorScale: ['#7DC3E8', '#39A5DC', '#007BBA', '#00659C', '#004D76'],
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
  legendContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  legend: {
    paddingTop: global_spacer_2xl.value,
    marginLeft: '-100px',
  },
  legendWrap: {
    paddingTop: global_spacer_2xl.value,
    marginLeft: '100px;',
    height: '100px;',
  },
  title: {
    marginLeft: '-' + global_spacer_lg.value,
  },
});
