import { StyleSheet } from '@patternfly/react-styles';
import {
  global_disabled_color_200,
  global_FontFamily_sans_serif,
  global_FontSize_md,
  global_spacer_lg,
  global_spacer_sm,
} from '@patternfly/react-tokens';

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
  legend: {
    labels: {
      fontFamily: global_FontFamily_sans_serif.value,
      fontSize: 14,
    },
    minWidth: 175,
  },
  previousMonth: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_200.value,
    },
  },
  currentMonth: {
    data: {
      fill: 'none',
      stroke: '#A2DA9C',
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
      padding: 15,
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
  chartContainer: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
  legend: {
    display: 'inline-block',
    fontSize: global_FontSize_md.value,
    marginTop: global_spacer_lg.value,
    minWidth: '175px',
  },
  legendTitle: {
    marginBottom: global_spacer_sm.value,
  },
});
