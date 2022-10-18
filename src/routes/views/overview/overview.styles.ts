import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_FontSize_md from '@patternfly/react-tokens/dist/js/global_FontSize_md';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md';
import React from 'react';

export const styles = {
  date: {
    alignSelf: 'center',
    flexGrow: 1,
    textAlign: 'end',
  },
  costType: {
    marginLeft: global_spacer_md.var,
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
  },
  headerContentRight: {
    display: 'flex',
  },
  infoIcon: {
    fontSize: global_FontSize_md.value,
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  main: {
    padding: global_spacer_lg.value,
  },
  tabs: {
    backgroundColor: global_BackgroundColor_light_100.var,
    paddingBottom: global_spacer_lg.var,
    paddingTop: global_spacer_lg.var,
  },
} as { [className: string]: React.CSSProperties };
