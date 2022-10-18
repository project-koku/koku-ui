import global_Color_dark_100 from '@patternfly/react-tokens/dist/js/global_Color_dark_100';
import global_Color_light_100 from '@patternfly/react-tokens/dist/js/global_Color_light_100';
import global_primary_color_100 from '@patternfly/react-tokens/dist/js/global_primary_color_100';
import global_primary_color_200 from '@patternfly/react-tokens/dist/js/global_primary_color_200';
import global_success_color_100 from '@patternfly/react-tokens/dist/js/global_success_color_100';
import global_success_color_200 from '@patternfly/react-tokens/dist/js/global_success_color_200';
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
