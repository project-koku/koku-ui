import { StyleSheet } from '@patternfly/react-styles';
import { global_Color_200 } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '75vh',
    marginTop: '30px',
  },
  cardBody: {
    textAlign: 'center',
  },
  primaryAction: {
    marginTop: '60px',
  },
  subtitle: {
    color: global_Color_200.var,
    marginTop: '30px',
  },
  title: {
    marginTop: '30px',
  },
});
