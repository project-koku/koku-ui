import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_dark_100,
  global_BackgroundColor_dark_200,
  global_primary_color_100,
  global_primary_color_200,
} from '@patternfly/react-tokens';
import { VictoryStyleInterface } from 'victory';

export const chartStyles = {
  padding: 5,
  group: {
    data: { strokeWidth: 2, fillOpacity: 0.4 },
  } as VictoryStyleInterface,
  tooltipText: { fontSize: '18px', fill: '#fff' } as React.CSSProperties,
  tooltipFlyout: { fill: 'black' } as React.CSSProperties,
  previousMonth: {
    data: {
      fill: global_BackgroundColor_dark_200.value,
      stroke: global_BackgroundColor_dark_100.value,
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
    ':not(foo) text': {
      fontSize: '12px',
      length: '12px',
    },
  },
});
