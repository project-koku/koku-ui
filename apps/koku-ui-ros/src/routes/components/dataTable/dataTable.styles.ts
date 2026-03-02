import t_global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_color_disabled_100 from '@patternfly/react-tokens/dist/js/t_global_color_disabled_100';
import t_global_font_size_xs from '@patternfly/react-tokens/dist/js/t_global_font_size_xs';
import t_global_spacer_3xl from '@patternfly/react-tokens/dist/js/t_global_spacer_3xl';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import t_global_spacer_xs from '@patternfly/react-tokens/dist/js/t_global_spacer_xs';
import type React from 'react';

export const styles = {
  costColumn: {
    textAlign: 'right',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 0,
  },
  defaultLabel: {
    minWidth: '50px',
  },
  emptyState: {
    backgroundColor: t_global_BackgroundColor_light_100.value,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: t_global_spacer_3xl.value,
    height: '35vh',
    width: '100%',
  },
  infoArrow: {
    position: 'relative',
  },
  infoArrowDesc: {
    bottom: t_global_spacer_xs.value,
  },
  infoDescription: {
    color: t_global_color_disabled_100.value,
    fontSize: t_global_font_size_xs.value,
  },
  lastItem: {
    textAlign: 'right',
    paddingRight: '2.0rem',
  },
  lastItemColumn: {
    textAlign: 'right',
  },
  managedColumn: {
    textAlign: 'right',
  },
  nameColumn: {
    width: '1%',
  },
  warningIcon: {
    paddingLeft: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
