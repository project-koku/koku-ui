import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_md } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  alert: {
    marginBottom: global_spacer_md.value,
  },
  modal: {
    // Workaround for isLarge not working properly
    width: '700px',
  },
});
