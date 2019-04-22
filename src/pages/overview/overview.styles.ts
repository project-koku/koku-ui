import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_lg, global_spacer_sm } from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  info: {
    marginLeft: global_spacer_sm.value,
    verticalAlign: 'middle',
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  tabs: {
    marginTop: global_spacer_lg.value,
  },
});

export const headerOverride = css`
  &.pf-c-page__main-section {
    --pf-c-page__main-section--PaddingBottom: 0;
  }
`;
