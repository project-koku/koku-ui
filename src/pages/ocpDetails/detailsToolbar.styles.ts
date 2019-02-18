import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_md } from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  export: {
    marginRight: global_spacer_md.value,
  },
});

export const btnOverride = css`
  &.pf-c-button {
    --pf-c-button--m-disabled--BackgroundColor: none;
  }
`;
