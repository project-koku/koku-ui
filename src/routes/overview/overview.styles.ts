import t_global_font_size_md from '@patternfly/react-tokens/dist/js/t_global_font_size_md';
import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import type React from 'react';

export const styles = {
  date: {
    alignSelf: 'center',
    flexGrow: 1,
    textAlign: 'end',
  },
  costType: {
    marginLeft: t_global_spacer_md.var,
  },
  headerContainer: {
    paddingBottom: 0,
  },
  headerContent: {
    display: 'flex',
  },
  headerContentLeft: {
    display: 'flex',
  },
  headerContentRight: {
    display: 'flex',
  },
  infoIcon: {
    fontSize: t_global_font_size_md.value,
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  tabs: {
    paddingBottom: t_global_spacer_lg.var,
    paddingTop: t_global_spacer_lg.var,
  },
} as { [className: string]: React.CSSProperties };
