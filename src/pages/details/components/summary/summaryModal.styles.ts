import { global_spacer_lg } from '@patternfly/react-tokens/dist/esm/global_spacer_lg';
import { global_spacer_xl } from '@patternfly/react-tokens/dist/esm/global_spacer_xl';
import { css } from 'emotion';
import React from 'react';

export const styles = {
  mainContent: {
    marginTop: global_spacer_xl.value,
  },
  subTitle: {
    textAlign: 'right',
  },
} as { [className: string]: React.CSSProperties };

export const modalOverride = css`
  /* Workaround for isLarge not working properly */
  &.pf-c-modal-box {
    height: 700px;
    width: 600px;
  }
  & .pf-c-modal-box__body {
    margin-top: ${global_spacer_lg.value};
  }
  & .pf-c-modal-box__footer {
    display: none;
  }
`;
