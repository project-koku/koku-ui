import { StyleSheet } from '@patternfly/react-styles';
import { theme } from '../../styles/theme';

export const chartStyles = {
  // See: https://github.com/project-koku/koku-ui/issues/241
  colorScale: ['#7DC3E8', '#39A5DC', '#007BBA', '#00659C', '#004D76'],
};

export const styles = StyleSheet.create({
  chartContainer: {
    [theme.page_breakpoint]: {
      display: 'inline-flex',
    },
    marginTop: '2rem',
  },
});
