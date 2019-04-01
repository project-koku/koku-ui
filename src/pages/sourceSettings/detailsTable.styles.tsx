import { css } from 'emotion';

export const tableOverride = css`
  &.pf-c-table {
    thead th + th {
      .pf-c-button {
        text-align: right;
      }
      text-align: right;
    }
    tbody td + td + td {
      text-align: right;
    }
    td {
      vertical-align: top;
    }
  }
`;
