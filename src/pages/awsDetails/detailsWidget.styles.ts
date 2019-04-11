import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_md, global_spacer_xl } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  skeleton: {
    marginTop: global_spacer_md.value,
  },
  tabs: {
    marginTop: global_spacer_xl.value,
  },
  viewAllContainer: {
    marginLeft: '-18px',
    paddingTop: global_spacer_md.value,
  },
});
