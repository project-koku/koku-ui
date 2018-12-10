import { global_Color_100 } from '@patternfly/react-tokens';
import { css } from 'emotion';

export const bulletChartOverride = css`
  & .bullet-chart-pf,
  & .bullet-chart-pf-legend-item {
    color: ${global_Color_100.value};
  }
  & .bullet-chart-pf-legend-item-text {
    max-width: none;
    text-overflow: initial;
  }
  & .bullet-chart-pf-overflow {
    flex: none;
  }
`;
