import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_font_size_body_sm from '@patternfly/react-tokens/dist/js/t_global_font_size_body_sm';
import t_global_spacer_3xl from '@patternfly/react-tokens/dist/js/t_global_spacer_3xl';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import t_global_spacer_xs from '@patternfly/react-tokens/dist/js/t_global_spacer_xs';
import t_global_text_color_subtle from '@patternfly/react-tokens/dist/js/t_global_text_color_subtle';
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
    backgroundColor: t_global_background_color_100.value,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: t_global_spacer_3xl.value,
    height: '35vh',
    width: '100%',
  },
  expandableRowContent: {
    paddingBottom: 4,
    paddingTop: 4,
  },
  infoArrow: {
    position: 'relative',
  },
  infoArrowDesc: {
    bottom: t_global_spacer_xs.value,
  },
  infoDescription: {
    color: t_global_text_color_subtle.value,
    fontSize: t_global_font_size_body_sm.value,
  },
  lastItem: {
    textAlign: 'right',
    paddingRight: '3.8rem',
  },
  lastItemColumn: {
    textAlign: 'right',
    display: 'flex',
    justifyContent: 'flex-end',
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
