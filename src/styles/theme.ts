import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_box_shadow_sm_right from '@patternfly/react-tokens/dist/js/t_global_box_shadow_sm_right';
import t_global_breakpoint_lg from '@patternfly/react-tokens/dist/js/t_global_breakpoint_lg';
import t_global_breakpoint_md from '@patternfly/react-tokens/dist/js/t_global_breakpoint_md';
import t_global_breakpoint_sm from '@patternfly/react-tokens/dist/js/t_global_breakpoint_sm';
import t_global_breakpoint_xl from '@patternfly/react-tokens/dist/js/t_global_breakpoint_xl';
import t_global_breakpoint_xs from '@patternfly/react-tokens/dist/js/t_global_breakpoint_xs';

const createBreakpoint = (size: string) => `@media (min-width: ${size})`;

const breakpoints = {
  xs: createBreakpoint(t_global_breakpoint_xs.value),
  sm: createBreakpoint(t_global_breakpoint_sm.value),
  md: createBreakpoint(t_global_breakpoint_md.value),
  lg: createBreakpoint(t_global_breakpoint_lg.value),
  xl: createBreakpoint(t_global_breakpoint_xl.value),
};

export const theme = {
  breakpoints,
  page_breakpoint: breakpoints.md,
  page_masthead_height: 70,
  page_sidebar_background: t_global_background_color_100.value,
  page_sidebar_boxShadow: t_global_box_shadow_sm_right.value,
  page_sidebar_width: 300,
};
