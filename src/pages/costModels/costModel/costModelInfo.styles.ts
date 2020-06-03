import {
  global_BackgroundColor_100,
  global_BackgroundColor_200 as global_BackgroundColor_300,
  global_spacer_lg,
  global_spacer_md,
  global_spacer_sm,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  headerDescription: {
    width: '97%',
    wordWrap: 'break-word',
  },
  sourceSettings: {
    backgroundColor: global_BackgroundColor_300.var,
  },
  content: {
    backgroundColor: global_BackgroundColor_300.var,
    paddingTop: global_spacer_xl.value,
    height: '182vh',
  },
  costmodelsContainer: {
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
    backgroundColor: global_BackgroundColor_100.value,
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
    paddingLeft: global_spacer_xl.value,
    paddingRight: global_spacer_xl.value,
  },
  headerCostModel: {
    padding: global_spacer_lg.var,
    paddingBottom: 0,
    backgroundColor: global_BackgroundColor_100.var,
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
