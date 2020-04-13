import {
  global_Color_dark_100,
  global_Color_light_100,
  global_primary_color_100,
  global_primary_color_200,
  global_success_color_100,
  global_success_color_200,
} from '@patternfly/react-tokens';
import { css } from 'emotion';
import React from 'react';

export const chartStyles = {
  padding: 8,
  group: {
    data: { strokeWidth: 2, fillOpacity: 0.4 },
  },
  tooltipText: {
    fontSize: '14px',
    fill: global_Color_light_100.value,
  } as React.CSSProperties,
  tooltipFlyout: { fill: global_Color_dark_100.value } as React.CSSProperties,
  previousMonth: {
    data: {
      fill: global_success_color_200.value,
      stroke: global_success_color_100.value,
    },
  },
  currentMonth: {
    data: {
      fill: global_primary_color_100.value,
      stroke: global_primary_color_200.value,
    },
  },
};

export const chartOverride = css`
  :not(foo) svg {
    overflow: visible;
  }
`;
