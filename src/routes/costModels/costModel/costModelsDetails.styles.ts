import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import React from 'react';

export const styles = {
  headerDescription: {
    width: '97%',
    wordWrap: 'break-word',
  },
  content: {
    paddingTop: global_spacer_lg.value,
    height: '182vh',
  },
  costmodelsContainer: {
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
    paddingLeft: global_spacer_lg.value,
    paddingRight: global_spacer_lg.value,
  },
  currency: {
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_lg.value,
  },
  tableContainer: {
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
  },
  paginationContainer: {
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
    paddingLeft: global_spacer_lg.value,
    paddingRight: global_spacer_lg.value,
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
    marginBottom: global_spacer_lg.value,
    backgroundColor: global_BackgroundColor_light_100.value,
  },
  toolbarContainer: {
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
    backgroundColor: global_BackgroundColor_light_100.value,
  },
  header: {
    padding: global_spacer_lg.var,
    backgroundColor: global_BackgroundColor_light_100.var,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerCostModel: {
    padding: global_spacer_lg.value,
    paddingBottom: 0,
    backgroundColor: global_BackgroundColor_light_100.var,
  },
  breadcrumb: {
    paddingBottom: global_spacer_md.var,
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
  sourceTypeTitle: {
    paddingBottom: global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };
