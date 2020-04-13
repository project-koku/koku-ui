import { global_spacer_md } from '@patternfly/react-tokens';
import { css } from 'emotion';

export const reportSummaryItem = css`
  :not(:last-child): {
    marginbottom: ${global_spacer_md.value};
  }
`;
