import { global_spacer_3xl } from '@patternfly/react-tokens/dist/esm/global_spacer_3xl';
import { global_spacer_md } from '@patternfly/react-tokens/dist/esm/global_spacer_md';
import { css } from 'emotion';
import React from 'react';

export const modalOverride = css`
  /* Workaround for isLarge not working properly */
  &.pf-c-modal-box {
    height: '900px';
    width: 1200px;
  }
  & .pf-c-modal-box__footer {
    display: none;
  }
`;

export const styles = {
  skeleton: {
    height: '125px',
    marginBottom: global_spacer_md.value,
    marginTop: global_spacer_3xl.value,
  },
} as { [className: string]: React.CSSProperties };
