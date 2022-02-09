import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_Color_100 from '@patternfly/react-tokens/dist/js/global_Color_100';
import global_FontSize_sm from '@patternfly/react-tokens/dist/js/global_FontSize_sm';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import React from 'react';

export const styles = {
  costValue: {
    marginTop: global_spacer_lg.var,
    marginBottom: 0,
  },
  costLabelUnit: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_100.var,
  },
  costType: {
    display: 'flex',
    marginLeft: global_spacer_md.var,
  },
  dateTitle: {
    textAlign: 'end',
  },
  header: {
    backgroundColor: global_BackgroundColor_light_100.var,
    padding: global_spacer_lg.var,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerContentLeft: {
    display: 'flex',
    minHeight: '90px',
  },
  headerContentRight: {
    display: 'flex',
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
