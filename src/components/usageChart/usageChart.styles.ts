import { StyleSheet } from '@patternfly/react-styles';
import {
  global_primary_color_100,
  global_success_color_100,
  global_warning_color_100,
  global_warning_color_200,
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
      stroke: global_warning_color_100.value,
    },
  } as VictoryStyleInterface,
  currentUsageData: {
    data: {
      fill: 'none',
      stroke: global_primary_color_100.value,
    },
  } as VictoryStyleInterface,
  previousRequestData: {
    data: {
      fill: 'none',
      stroke: global_warning_color_200.value,
    },
  } as VictoryStyleInterface,
  previousUsageData: {
    data: {
      fill: 'none',
      stroke: global_success_color_100.value,
    },
  } as VictoryStyleInterface,
  requestColorScale: [
    global_warning_color_200.value,
    global_warning_color_100.value,
  ],
  usageColorScale: [
    global_success_color_100.value,
    global_primary_color_100.value,
  ],
};

export const styles = StyleSheet.create({
  reportSummaryTrend: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
});
