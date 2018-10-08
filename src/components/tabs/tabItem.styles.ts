import { StyleSheet } from '@patternfly/react-styles';
import {
  global_FontSize_sm,
  global_primary_color_200,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  tabItem: {
    position: 'relative',
    flexGrow: 1,
    textAlign: 'center',
    fontSize: global_FontSize_sm.value,
    padding: global_spacer_sm.value,
    cursor: 'pointer',
    marginBottom: global_spacer_md.value,
    marginTop: global_spacer_md.value,
  },
  selected: {
    backgroundImage: `linear-gradient(to top, ${
      global_primary_color_200.value
    } 2px, transparent 2px)`,
  },
});
