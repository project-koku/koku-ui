import { StyleSheet } from '@patternfly/react-styles';
import { global_primary_color_200 } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(0, 123, 186, 0.2)',
  },
  bar: {
    height: '100%',
    backgroundColor: global_primary_color_200.value,
  },
});
