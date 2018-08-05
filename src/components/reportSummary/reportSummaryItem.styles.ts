import { StyleSheet } from '@patternfly/react-styles';
import { global_FontSize_xs, global_spacer_md } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  reportSummaryItem: {
    ':not(:last-child)': {
      marginBottom: global_spacer_md.value,
    },
  },
  info: {
    display: 'flex',
    fontSize: global_FontSize_xs.value,
    justifyContent: 'space-between',
  },
  test: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
});
