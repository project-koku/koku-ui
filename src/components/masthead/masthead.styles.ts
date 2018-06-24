import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_dark_100,
  global_gutter,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  masthead: {
    height: 60,
    backgroundColor: global_BackgroundColor_dark_100.value,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: global_gutter.value,
    paddingRight: global_gutter.value,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'capitalize',
  },
  name: {
    marginRight: global_spacer_sm.value,
  },
});
