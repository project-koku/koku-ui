import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_3xl, global_spacer_sm } from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  tagsContainer: {
    marginRight: global_spacer_3xl.value,
    marginTop: global_spacer_sm.value,
  },
});

export const popoverOverride = css`
  &.pf-c-popover {
    --pf-c-popover--MaxWidth: 600px;
  }
`;
