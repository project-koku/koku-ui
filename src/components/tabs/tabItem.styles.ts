import { StyleSheet } from '@patternfly/react-styles';
import {
  global_primary_color_200,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  tabItem: {
    position: 'relative',
    flexGrow: 1,
    textAlign: 'center',
    padding: global_spacer_sm.value,
    cursor: 'pointer',
  },
  selected: {
    ':after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: global_primary_color_200.value,
    },
  },
});
