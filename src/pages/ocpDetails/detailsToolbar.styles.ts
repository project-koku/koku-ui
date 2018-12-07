import { css } from 'emotion';

export const btnOverride = css`
  &.pf-c-button {
    --pf-c-button--m-disabled--BackgroundColor: none;
  }
`;

export const toggleOverride = css`
  &.pf-c-dropdown__toggle {
    --pf-c-dropdown__toggle--MinHeight: auto;
  }
`;
