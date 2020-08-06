import { global_FontSize_md } from '@patternfly/react-tokens/dist/esm/global_FontSize_md';
import { global_spacer_lg } from '@patternfly/react-tokens/dist/esm/global_spacer_lg';
import { global_spacer_sm } from '@patternfly/react-tokens/dist/esm/global_spacer_sm';
import { css } from 'emotion';
import React from 'react';

export const styles = {
  info: {
    marginLeft: global_spacer_sm.value,
    verticalAlign: 'middle',
  },
  infoIcon: {
    fontSize: global_FontSize_md.value,
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  perspective: {
    marginBottom: global_spacer_lg.value,
    marginTop: global_spacer_lg.value,
  },
  tabs: {
    marginTop: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };

export const headerOverride = css`
  &.pf-c-page__main-section {
    --pf-c-page__main-section--PaddingBottom: 0;
  }
`;
