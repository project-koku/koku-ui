import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_lg } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    marginTop: '150px',
  },
  viewSources: {
    marginTop: global_spacer_lg.value,
  },
});
