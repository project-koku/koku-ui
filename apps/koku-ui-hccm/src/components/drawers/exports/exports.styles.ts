import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  content: {
    paddingBottom: t_global_spacer_lg.value,
    paddingTop: t_global_spacer_lg.value,
  },
  exportsIcon: {
    marginLeft: t_global_spacer_md.value,
    marginRight: t_global_spacer_sm.value,
  },
  exportsLink: {
    display: 'flex',
    alignItems: 'center',
  },
  pagination: {
    backgroundColor: t_global_background_color_100.value,
    paddingBottom: t_global_spacer_md.value,
    paddingTop: t_global_spacer_md.value,
  },
  toolbarContainer: {
    backgroundColor: t_global_background_color_100.value,
    paddingBottom: t_global_spacer_md.value,
    paddingTop: t_global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };
