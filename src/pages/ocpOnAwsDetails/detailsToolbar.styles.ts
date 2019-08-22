import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_100,
  global_spacer_md,
  global_spacer_xl,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  export: {
    marginRight: global_spacer_md.value,
  },
  paginationContainer: {
    width: '100%',
  },
  toolbarContainer: {
    backgroundColor: global_BackgroundColor_100.value,
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
    paddingLeft: global_spacer_xl.value,
    paddingRight: global_spacer_xl.value,
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
  },
});
