import { global_spacer_md } from '@patternfly/react-tokens/dist/esm/global_spacer_md'
import { css } from 'emotion';

export const reportSummaryItem = css`
  :not(:last-child) {
    margin-bottom: ${global_spacer_md.value};
  }
`;
