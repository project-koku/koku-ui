import { StyleSheet } from '@patternfly/react-styles';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  chartInline: {
    [theme.page_breakpoint]: {
      display: 'inline-flex',
    },
    marginTop: '2rem',
  },
});
