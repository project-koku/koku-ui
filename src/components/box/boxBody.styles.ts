import { StyleSheet } from '@patternfly/react-styles';

export const styles = StyleSheet.create({
  boxBody: {
    flex: '1 1 auto',
    paddingTop: '1rem',
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
