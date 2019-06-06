import { StyleSheet } from '@patternfly/react-styles';
import {
  global_danger_color_100,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const chartStyles = {
  height: 55,
  itemsPerRow: 2,
  legendHeight: 30,
  // See: https://github.com/project-koku/koku-ui/issues/241
  rangeColorScale: [
    '#ededed',
    '#d1d1d1',
    '#bbb',
    '#72767b',
    '#72767b',
    '#282d33',
  ],
  rangeWidth: 40,
  thresholdErrorColor: global_danger_color_100.value,
  thresholdErrorWidth: 2,
  // See: https://github.com/project-koku/koku-ui/issues/241
  valueColorScale: [
    '#007BBA',
    '#bee1f4',
    '#7DC3E8',
    '#39A5DC',
    '#00659C',
    '#004D76',
  ],
  valueWidth: 9,
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
