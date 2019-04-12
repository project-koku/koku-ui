import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_md } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  skeleton: {
    marginTop: global_spacer_md.value,
  },
  summary: {
    paddingTop: global_spacer_md.value,
  },
  viewAllContainer: {
    marginLeft: '-18px',
    paddingTop: global_spacer_md.value,
  },
});
