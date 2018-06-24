import { StyleSheet } from '@patternfly/react-styles';
import {
  global_FontWeight_normal,
  global_gutter,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  formGroup: {
    marginBottom: global_gutter.value,
  },
  label: {
    display: 'block',
    fontWeight: global_FontWeight_normal.value as any,
    paddingBottom: global_spacer_sm.value,
  },
});
