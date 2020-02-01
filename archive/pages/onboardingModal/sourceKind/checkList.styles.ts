import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_md } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  listWrapper: {
    paddingLeft: global_spacer_md.value,
    marginBottom: global_spacer_md.value,
    marginTop: `-${global_spacer_md.value}`,
  },
  listTitle: {
    marginBottom: global_spacer_md.value,
  },
});
