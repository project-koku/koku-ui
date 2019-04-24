import { StyleSheet } from '@patternfly/react-styles';

export const styles = StyleSheet.create({
  boxFooter: {
    flex: '0 0 auto',
    paddingTop: '1rem',
    paddingRight: '2rem',
    paddingBottom: '1rem',
    paddingLeft: '2rem',
    ':last-child': {
      paddingBottom: '2rem',
    },
  },
});
