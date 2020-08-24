import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_BoxShadow_sm_right from '@patternfly/react-tokens/dist/js/global_BoxShadow_sm_right';
import global_breakpoint_lg from '@patternfly/react-tokens/dist/js/global_breakpoint_lg';
import global_breakpoint_md from '@patternfly/react-tokens/dist/js/global_breakpoint_md';
import global_breakpoint_sm from '@patternfly/react-tokens/dist/js/global_breakpoint_sm';
import global_breakpoint_xl from '@patternfly/react-tokens/dist/js/global_breakpoint_xl';
import global_breakpoint_xs from '@patternfly/react-tokens/dist/js/global_breakpoint_xs';
import global_Color_dark_100 from '@patternfly/react-tokens/dist/js/global_Color_dark_100';

const createBreakpoint = (size: string) => `@media (min-width: ${size})`;

const breakpoints = {
  xs: createBreakpoint(global_breakpoint_xs.value),
  sm: createBreakpoint(global_breakpoint_sm.value),
  md: createBreakpoint(global_breakpoint_md.value),
  lg: createBreakpoint(global_breakpoint_lg.value),
  xl: createBreakpoint(global_breakpoint_xl.value),
};

export const theme = {
  breakpoints,
  page_breakpoint: breakpoints.md,
  page_masthead_height: 70,
  page_sidebar_background: global_BackgroundColor_light_100.value,
  page_sidebar_boxShadow: global_BoxShadow_sm_right.value,
  page_sidebar_width: 300,
  verticalNav_color: global_Color_dark_100.value,
  verticalNav_link_color: global_Color_dark_100.value,
};
