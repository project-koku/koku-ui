import { StyleSheet } from '@patternfly/react-styles';
import { theme } from 'styles/theme';
import {
  chart_color_blue_100,
  chart_color_blue_200,
  chart_color_blue_300,
  chart_color_blue_400,
  chart_color_blue_500
} from '@patternfly/react-tokens';

export const chartStyles = {
  // See: https://github.com/project-koku/koku-ui/issues/241
  colorScale: [
    // '#7DC3E8',
    // '#39A5DC',
    // '#007BBA',
    // '#00659C',
    // '#004D76'
    chart_color_blue_100.value,
    chart_color_blue_200.value,
    chart_color_blue_300.value,
    chart_color_blue_400.value,
    chart_color_blue_500.value
  ],
};

export const styles = StyleSheet.create({
  chartContainer: {
    [theme.page_breakpoint]: {
      display: 'inline-flex',
    },
    marginTop: '2rem',
  },
});
