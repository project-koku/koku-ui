import {
  global_BackgroundColor_light_100,
  global_BoxShadow_sm_right,
  global_breakpoint_lg,
  global_breakpoint_md,
  global_breakpoint_sm,
  global_breakpoint_xl,
  global_breakpoint_xs,
  global_Color_dark_100,
} from '@patternfly/react-tokens';

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
