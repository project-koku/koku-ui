import { StyleSheet } from '@patternfly/react-styles';
import {
  global_disabled_color_200,
  global_FontFamily_sans_serif,
  global_FontSize_md,
  global_spacer_lg,
  global_spacer_sm,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import { VictoryStyleInterface } from 'victory';

export const chartStyles = {
  // See: https://github.com/project-koku/koku-ui/issues/241
  colorScale: [
    global_disabled_color_200.value,
    '#A2DA9C',
    '#88D080',
    '#6EC664',
    '#519149',
    '#3C6C37',
  ],
  currentMonth: {
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
  previousMonth: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_200.value,
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
  },
  title: {
    paddingLeft: global_spacer_sm.value,
  },
});
