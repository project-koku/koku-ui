import { StyleSheet } from '@patternfly/react-styles';
import {
  global_danger_color_100,
  global_spacer_md,
} from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  measureChart: {
    paddingTop: global_spacer_md.value,
  },
});

export const bulletChartOverride = css`
  & .bullet-chart-pf-title-container {
    padding-right: 0;
  }
  & .bullet-chart-pf-legend-item-box.error {
    background-color: ${global_danger_color_100.value};
  }
  & .bullet-chart-pf-legend-item-text {
    max-width: none;
    text-overflow: initial;
  }
  & .bullet-chart-pf-overflow {
    flex: none;
  }
`;
