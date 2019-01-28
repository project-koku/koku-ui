import { StyleSheet } from '@patternfly/react-styles';
import {
  global_danger_color_100,
  global_danger_color_200,
  global_disabled_color_100,
  global_disabled_color_200,
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
  capacityColorScale: [
    global_disabled_color_200.value,
    global_disabled_color_100.value,
  ],
  currentCapacityData: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_100.value,
    },
  } as VictoryStyleInterface,
  currentLimitData: {
    data: {
      fill: 'none',
      stroke: global_danger_color_200.value,
    },
  } as VictoryStyleInterface,
  currentRequestData: {
    data: {
      fill: 'none',
      stroke: global_warning_color_200.value,
    },
  } as VictoryStyleInterface,
  currentUsageData: {
    data: {
      fill: 'none',
      stroke: global_primary_color_100.value,
    },
  } as VictoryStyleInterface,
  limitColorScale: [
    global_danger_color_100.value,
    global_danger_color_200.value,
  ],
  previousCapacityData: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_200.value,
    },
  } as VictoryStyleInterface,
  previousLimitData: {
    data: {
      fill: 'none',
      stroke: global_danger_color_100.value,
    },
  } as VictoryStyleInterface,
  previousRequestData: {
    data: {
      fill: 'none',
      stroke: global_warning_color_100.value,
    },
  } as VictoryStyleInterface,
  previousUsageData: {
    data: {
      fill: 'none',
      stroke: global_success_color_100.value,
    },
  } as VictoryStyleInterface,
  usageColorScale: [
    global_success_color_100.value,
    global_primary_color_100.value,
  ],
  requestColorScale: [
    global_warning_color_100.value,
    global_warning_color_200.value,
  ],
};

export const styles = StyleSheet.create({
  legendContainer: {
    display: 'flex',
    marginTop: '20px',
  },
  reportSummaryTrend: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
    textAlign: 'center',
  },
});
