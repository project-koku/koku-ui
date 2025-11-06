import t_global_background_color_100 from '@patternfly/react-tokens/dist/js/t_global_background_color_100';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  headerDescription: {
    width: '97%',
    wordWrap: 'break-word',
  },
  content: {
    paddingTop: t_global_spacer_lg.value,
    height: '182vh',
  },
  currency: {
    paddingBottom: t_global_spacer_md.value,
    paddingTop: t_global_spacer_lg.value,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerCostModel: {
    padding: t_global_spacer_lg.value,
    paddingBottom: 0,
    backgroundColor: t_global_background_color_100.var,
  },
  breadcrumb: {
    paddingBottom: t_global_spacer_md.var,
  },
  title: {
    paddingBottom: t_global_spacer_sm.var,
  },
  sourceTypeTitle: {
    paddingBottom: t_global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };
