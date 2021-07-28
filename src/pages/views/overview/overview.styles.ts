import global_FontSize_md from '@patternfly/react-tokens/dist/js/global_FontSize_md';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import React from 'react';

export const styles = {
  date: {
    alignSelf: 'center',
    flexGrow: 1,
    textAlign: 'end',
  },
  infoIcon: {
    fontSize: global_FontSize_md.value,
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  perspective: {
    display: 'flex',
    marginTop: global_spacer_lg.value,
  },
  tabs: {
    marginTop: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };
