import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_md, global_spacer_sm } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  groupBySelector: {
    display: 'flex',
    alignItems: 'center',
  },
  groupBySelectorLabel: {
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
});
