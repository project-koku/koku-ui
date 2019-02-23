import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_dark_100,
  global_BackgroundColor_dark_200,
  global_BorderWidth_sm,
  global_Color_dark_200,
  global_FontSize_xs,
  global_primary_color_100,
  global_primary_color_200,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import { VictoryStyleInterface } from 'victory';

export const chartStyles = {
  height: 150,
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
  },
  title: {
    fontSize: global_FontSize_xs.value,
    marginBottom: global_spacer_sm.value,
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: global_FontSize_xs.value,
    color: global_Color_dark_200.value,
    marginRight: global_spacer_md.value,
  },
  color: {
    height: 10,
    width: 10,
    marginRight: global_spacer_sm.value,
    borderWidth: global_BorderWidth_sm.value,
    borderStyle: 'solid',
  },
  currentMonthColor: {
    backgroundColor: chartStyles.currentMonth.data.fill,
    borderColor: chartStyles.currentMonth.data.stroke,
  },
  prevMonthColor: {
    backgroundColor: chartStyles.previousMonth.data.fill,
    borderColor: chartStyles.previousMonth.data.stroke,
  },
});
