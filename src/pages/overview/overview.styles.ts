import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_lg } from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  tabs: {
    marginTop: global_spacer_lg.value,
  },
});

export const headerOverride = css`
  &.pf-c-page__main-section {
    --pf-c-page__main-section--PaddingBottom: 0;
  }
`;
