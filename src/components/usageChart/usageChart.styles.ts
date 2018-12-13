import { StyleSheet } from '@patternfly/react-styles';
import {
  global_primary_color_100,
  global_success_color_100,
  global_warning_color_100,
  global_warning_color_200,
} from '@patternfly/react-tokens';
import { VictoryStyleInterface } from 'victory';

export const chartStyles = {
  currentColorScale: [
    global_success_color_100.value,
    global_primary_color_100.value,
  ],
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
  previousColorScale: [
    global_warning_color_200.value,
    global_warning_color_100.value,
  ],
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
};

export const styles = StyleSheet.create({
  reportSummaryTrend: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
});
