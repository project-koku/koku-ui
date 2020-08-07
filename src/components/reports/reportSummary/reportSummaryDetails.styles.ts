import global_Color_100 from '@patternfly/react-tokens/dist/js/global_Color_100';
import global_FontSize_4xl from '@patternfly/react-tokens/dist/js/global_FontSize_4xl';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import global_LineHeight_sm from '@patternfly/react-tokens/dist/js/global_LineHeight_sm';
import global_spacer_md from '@patternfly/react-tokens/dist/js/global_spacer_md'
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import global_spacer_xs from '@patternfly/react-tokens/dist/js/global_spacer_xs';
import React from 'react';

export const styles = {
  reportSummaryDetails: {
    marginBottom: global_spacer_md.value,
    display: 'flex',
    alignItems: 'flex-end',
  },
  text: {
    paddingBottom: global_spacer_sm.value,
    lineHeight: global_LineHeight_sm.value,
    fontSize: global_FontSize_xs.value,
  },
  units: {
    paddingLeft: global_spacer_xs.value,
    paddingBottom: global_spacer_sm.value,
    lineHeight: global_LineHeight_sm.value,
    fontSize: global_FontSize_xs.value,
    whiteSpace: 'nowrap',
  },
  value: {
    color: global_Color_100.var,
    marginRight: global_spacer_sm.value,
    fontSize: global_FontSize_4xl.value,
  },
  valueContainer: {
    display: 'inline-block',
    marginBottom: global_spacer_md.value,
    width: '50%',
    wordWrap: 'break-word',
  },
} as { [className: string]: React.CSSProperties };
