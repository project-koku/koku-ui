import { StyleSheet } from '@patternfly/react-styles';
import {
  global_Color_200,
  global_FontSize_xs,
  global_spacer_lg,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  cost: {
    flexGrow: 1,
    minHeight: '440px',
  },
  reportSummary: {
    height: '100%',
  },
  subtitle: {
    fontSize: global_FontSize_xs.value,
    color: global_Color_200.var,
    marginBottom: '0',
  },
  tops: {
    flexGrow: 1,
    marginTop: global_spacer_lg.value,
  },
});
