import { StyleSheet } from '@patternfly/react-styles';
import {
  global_spacer_sm,
  global_spacer_xl,
  global_spacer_xs,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  form: {
    marginLeft: global_spacer_sm.var,
  },
  modal: {
    h2: {
      marginBottom: global_spacer_xl.value,
    },
    input: {
      marginRight: global_spacer_xs.var,
    },
    ul: {
      marginLeft: global_spacer_sm.var,
    },
  },
  title: {
    paddingBottom: global_spacer_xl.var,
  },
});
