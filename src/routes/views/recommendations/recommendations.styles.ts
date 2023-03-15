import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import type React from 'react';

export const styles = {
  content: {
    paddingBottom: global_spacer_lg.value,
    paddingTop: global_spacer_lg.value,
  },
  header: {
    backgroundColor: global_BackgroundColor_light_100.var,
    padding: global_spacer_lg.var,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  paginationContainer: {
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
  },
  pagination: {
    backgroundColor: global_BackgroundColor_light_100.value,
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
  },
  recommendationsContainer: {
    minHeight: '100%',
  },
  tableContainer: {
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
  },
  toolbarContainer: {
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };
