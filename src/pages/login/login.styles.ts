import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_dark_100,
  global_spacer_2xl,
  global_spacer_md,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  alert: {
    marginBottom: global_spacer_md.value,
  },
  body: {
    backgroundColor: global_BackgroundColor_dark_100.value,
    minHeight: '100vh',
  },
  loginPage: {
    height: '100vh',
  },
  loginBox: {
    padding: global_spacer_2xl.value,
  },
});
