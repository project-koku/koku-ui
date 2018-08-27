import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_100,
  global_BackgroundColor_200,
  global_Color_100,
  global_Color_200,
  global_FontSize_sm,
  global_spacer_md,
  global_spacer_xl,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  costDetailsPage: {
    backgroundColor: global_BackgroundColor_200.var,
    minHeight: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: global_spacer_xl.var,
    backgroundColor: global_BackgroundColor_100.var,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  total: {
    display: 'flex',
    alignItems: 'center',
  },
  totalLabel: {},
  totalValue: {
    marginTop: 0,
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
  totalLabelUnit: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_100.var,
  },
  totalLabelDate: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_200.var,
  },
  groupBySelector: {
    display: 'flex',
    alignItems: 'center',
  },
  groupBySelectorLabel: {
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
});
