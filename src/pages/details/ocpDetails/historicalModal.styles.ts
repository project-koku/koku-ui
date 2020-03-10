import { css } from 'emotion';

// Workaround for isLarge not working properly
export const modalOverride = css`
  &.pf-c-modal-box {
    height: '900px';
    width: 1200px;
  }
  & .pf-c-modal-box__footer {
    display: none;
  }
`;
