import { StyleSheet } from '@patternfly/react-styles';
import {
  global_primary_color_100,
  global_primary_color_200,
  global_success_color_100,
  global_success_color_200,
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
  colorScale: [global_success_color_100.value, global_primary_color_100.value],
  previousMonth: {
    data: {
      fill: global_success_color_200.value,
      stroke: global_success_color_100.value,
    },
  } as VictoryStyleInterface,
  currentMonth: {
    data: {
      fill: global_primary_color_100.value,
      stroke: global_primary_color_200.value,
    },
  } as VictoryStyleInterface,
};

export const styles = StyleSheet.create({
  reportSummaryTrend: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
});
