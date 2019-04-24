import { StyleSheet } from '@patternfly/react-styles';

export const styles = StyleSheet.create({
  boxHeader: {
    flex: '0 0 auto',
    paddingTop: '2rem',
    paddingRight: '2rem',
    paddingBottom: '1rem',
    paddingLeft: '2rem',
    ':first-child': {
      paddingTop: '2rem',
    },
    ':last-child': {
      paddingBottom: '2rem',
    },
  },
});
