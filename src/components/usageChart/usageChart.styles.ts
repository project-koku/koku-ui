import { StyleSheet } from '@patternfly/react-styles';
import {
  global_disabled_color_100,
  global_disabled_color_200,
  global_FontFamily_sans_serif,
  global_FontSize_md,
  global_spacer_lg,
} from '@patternfly/react-tokens';
import { VictoryStyleInterface } from 'victory';

export const chartStyles = {
  axis: {
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
  previousRequestData: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_200.value,
      strokeDasharray: '3,3',
    },
  } as VictoryStyleInterface,
  previousUsageData: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_200.value,
    },
  } as VictoryStyleInterface,
  // See: https://github.com/project-koku/koku-ui/issues/241
  currentColorScale: ['#A2DA9C', '#88D080', '#6EC664', '#519149', '#3C6C37'],
  // TBD: No grey scale, yet
  previousColorScale: [
    global_disabled_color_200.value,
    global_disabled_color_100.value,
  ],
};

export const styles = StyleSheet.create({
  chartContainer: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
  legend: {
    display: 'inline-block',
    fontSize: global_FontSize_md.value,
    marginBottom: global_spacer_lg.value,
    minWidth: '175px',
    width: '50%',
  },
});
