import { global_spacer_2xl, global_spacer_lg } from '@patternfly/react-tokens';
import { css } from 'emotion';
import React from 'react';

export const styles = {
  subTitle: {
    marginTop: global_spacer_2xl.value,
    textAlign: 'right',
  },
} as { [className: string]: React.CSSProperties };

export const modalOverride = css`
  & .pf-c-modal-box__body {
    margin-top: ${global_spacer_lg.value};
  }
  & .pf-c-modal-box__footer {
    display: none;
  }
`;
