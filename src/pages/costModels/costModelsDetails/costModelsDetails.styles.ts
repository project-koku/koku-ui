import { global_BackgroundColor_light_100 } from '@patternfly/react-tokens/dist/esm/global_BackgroundColor_light_100';
import { global_spacer_md } from '@patternfly/react-tokens/dist/esm/global_spacer_md'
import { global_spacer_sm } from '@patternfly/react-tokens/dist/esm/global_spacer_sm';
import { global_spacer_xl } from '@patternfly/react-tokens/dist/esm/global_spacer_xl';
import React from 'react';

export const styles = {
  headerDescription: {
    width: '97%',
    wordWrap: 'break-word',
  },
  content: {
    paddingTop: global_spacer_xl.value,
    height: '182vh',
  },
  costmodelsContainer: {
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
    paddingLeft: global_spacer_xl.value,
    paddingRight: global_spacer_xl.value,
  },
  tableContainer: {
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
  },
  paginationContainer: {
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
    paddingLeft: global_spacer_xl.value,
    paddingRight: global_spacer_xl.value,
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
    marginBottom: global_spacer_xl.value,
    backgroundColor: global_BackgroundColor_light_100.value,
  },
  toolbarContainer: {
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
    backgroundColor: global_BackgroundColor_light_100.value,
  },
  header: {
    padding: global_spacer_xl.var,
    backgroundColor: global_BackgroundColor_light_100.var,
  },
  headerCostModel: {
    padding: global_spacer_md.value,
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
