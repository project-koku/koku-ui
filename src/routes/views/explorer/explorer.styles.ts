import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';

export const styles = {
  chartContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
    paddingRight: global_spacer_lg.value,
    paddingBottom: global_spacer_lg.value,
    paddingTop: global_spacer_lg.value,
  },
  chartContent: {
    paddingTop: global_spacer_lg.value,
  },
  defaultLabel: {
    minWidth: '63px',
  },
  explorer: {
    minHeight: '100%',
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
  tableContainer: {
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
  },
  tableContent: {
    paddingBottom: global_spacer_lg.value,
    paddingTop: global_spacer_lg.value,
  },
  toolbarContainer: {
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };
