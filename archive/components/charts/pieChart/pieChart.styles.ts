import {
  chart_color_blue_100,
  chart_color_blue_200,
  chart_color_blue_300,
  chart_color_blue_400,
  chart_color_blue_500,
} from '@patternfly/react-tokens';
import React from 'react';
import { theme } from 'styles/theme';

export const chartStyles = {
  // See: https://github.com/project-koku/koku-ui/issues/241
  colorScale: [
    chart_color_blue_100.value,
    chart_color_blue_200.value,
    chart_color_blue_300.value,
    chart_color_blue_400.value,
    chart_color_blue_500.value,
  ],
};

export const styles = {
  chartContainer: {
    [theme.page_breakpoint]: {
      display: 'inline-flex',
    },
    marginTop: '2rem',
  },
} as { [className: string]: React.CSSProperties };
