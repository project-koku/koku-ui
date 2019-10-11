import { StyleSheet } from '@patternfly/react-styles';
import { global_FontSize_xl, global_spacer_md } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  card: {
    minHeight: '130px',
    maxWidth: '400px',
    marginLeft: global_spacer_md.value,
  },
  cardBody: {
    fontSize: global_FontSize_xl.value,
    textAlign: 'center',
  },
});
