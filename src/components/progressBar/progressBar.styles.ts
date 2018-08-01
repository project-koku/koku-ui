import { StyleSheet } from '@patternfly/react-styles';
import {
  global_spacer_xs,
  global_warning_color_100,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  progressBar: {
    height: 25,
    padding: global_spacer_xs.value,
    border: '1px solid black',
  },
  bar: {
    height: '100%',
    backgroundColor: global_warning_color_100.value,
  },
});
