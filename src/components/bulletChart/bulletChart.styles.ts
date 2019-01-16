import { StyleSheet } from '@patternfly/react-styles';
import {
  c_button_disabled_BackgroundColor,
  global_Color_dark_100,
  global_Color_dark_200,
  global_danger_color_100,
  global_disabled_color_100,
  global_disabled_color_200,
  global_primary_color_200,
  global_primary_color_dark_100,
  global_primary_color_light_100,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const chartStyles = {
  height: 95,
  itemsPerRow: 2,
  legendHeight: 30,
  rangeColorScale: [
    c_button_disabled_BackgroundColor.value,
    global_disabled_color_200.value,
    global_disabled_color_100.value,
    global_Color_dark_200.value,
    global_Color_dark_100.value,
  ],
  rangeWidth: 80,
  thresholdErrorColor: global_danger_color_100.value,
  thresholdErrorWidth: 1,
  valueColorScale: [
    global_primary_color_light_100.value,
    global_primary_color_dark_100.value,
    global_primary_color_200.value,
  ],
  valueWidth: 30,
};

export const styles = StyleSheet.create({
  bulletChart: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
  bulletChartLegend: {
    marginTop: global_spacer_md.value,
  },
  bulletChartTitle: {
    paddingBottom: global_spacer_md.value,
    paddingLeft: global_spacer_sm.value,
  },
});
