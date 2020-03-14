import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_md } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  reportSummaryItem: {
    ':not(:last-child)': {
      marginBottom: global_spacer_md.value,
    },
  },
  test: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
});
