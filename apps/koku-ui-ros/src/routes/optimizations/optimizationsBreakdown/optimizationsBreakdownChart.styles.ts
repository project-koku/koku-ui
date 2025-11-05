import { chart_color_blue_100 } from '@patternfly/react-tokens/dist/js/chart_color_blue_100';
import { chart_color_blue_200 } from '@patternfly/react-tokens/dist/js/chart_color_blue_200';
import { chart_color_blue_400 } from '@patternfly/react-tokens/dist/js/chart_color_blue_400';
import { t_global_color_status_danger_200 } from '@patternfly/react-tokens/dist/js/t_global_color_status_danger_200';

export const chartStyles = {
  limit: {
    fill: 'none',
  },
  limitColorScale: [t_global_color_status_danger_200.var],
  request: {
    fill: 'none',
  },
  requestColorScale: [chart_color_blue_400.var],
  usageColorScale: [chart_color_blue_100.var, chart_color_blue_200.var],
};
