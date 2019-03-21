import { StyleSheet } from '@patternfly/react-styles';
import {
  global_spacer_2xl,
  global_spacer_3xl,
  global_spacer_xl,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  clusterContainer: {
    marginBottom: global_spacer_xl.value,
  },
  historicalContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: global_spacer_xl.value,
  },
  leftPane: {
    marginRight: global_spacer_3xl.value,
    paddingBottom: global_spacer_xl.value,
    paddingTop: global_spacer_xl.value,
  },
  rightPane: {
    marginRight: global_spacer_xl.value,
    marginLeft: global_spacer_2xl.value,
    paddingBottom: global_spacer_xl.value,
    paddingTop: global_spacer_xl.value,
  },
  tagsContainer: {
    marginBottom: global_spacer_xl.value,
  },
});
