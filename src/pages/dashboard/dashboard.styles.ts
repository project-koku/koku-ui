import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_100,
  global_spacer_xl,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  banner: {
    height: 60,
    backgroundColor: global_BackgroundColor_100.value,
    marginBottom: global_spacer_xl.value,
    padding: `0 ${global_spacer_xl.value}`,
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    padding: `0 ${global_spacer_xl.value}`,
  },
});
