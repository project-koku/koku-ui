import { global_spacer_md } from '@patternfly/react-tokens';
import { css } from 'emotion';

export const reportSummaryItem = css`
  :not(:last-child) {
    margin-bottom: ${global_spacer_md.value};
  }
`;
