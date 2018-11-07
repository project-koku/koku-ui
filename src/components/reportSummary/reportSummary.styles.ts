import { StyleSheet } from '@patternfly/react-styles';
import { global_Color_200, global_FontSize_xs } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  reportSummary: {
    height: '100%',
  },
  cardHeader: {
    paddingBottom: '0px !important',
  },
  cardBody: {
    paddingTop: '0px !important',
  },
  subtitle: {
    fontSize: global_FontSize_xs.value,
    color: global_Color_200.var,
  },
});
