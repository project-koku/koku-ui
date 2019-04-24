import { StyleSheet } from '@patternfly/react-styles';
import {
  c_backdrop_BackdropFilter,
  c_backdrop_Color,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    filter: c_backdrop_BackdropFilter.value,
    backgroundColor: c_backdrop_Color.value,
  },
});
