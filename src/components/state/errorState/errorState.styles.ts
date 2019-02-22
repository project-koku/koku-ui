import { StyleSheet } from '@patternfly/react-styles';
import { global_Color_200, global_spacer_lg } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  card: {
    height: '100vh',
    paddingLeft: global_spacer_lg.value,
    paddingRight: global_spacer_lg.value,
    marginTop: '150px',
  },
  cardBody: {
    textAlign: 'center',
  },
  subtitle: {
    color: global_Color_200.var,
    marginTop: '30px',
  },
  title: {
    marginTop: '30px',
  },
});
