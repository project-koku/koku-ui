import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_100,
  global_Color_100,
  global_Color_200,
  global_FontSize_md,
  global_FontSize_sm,
  global_spacer_md,
  global_spacer_sm,
  global_spacer_xl,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  cost: {
    display: 'flex',
    alignItems: 'center',
  },
  costLabel: {},
  costValue: {
    marginTop: 0,
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
  costLabelUnit: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_100.var,
  },
  costLabelDate: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_200.var,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: global_spacer_xl.var,
    backgroundColor: global_BackgroundColor_100.var,
  },
  info: {
    marginLeft: global_spacer_sm.value,
    verticalAlign: 'middle',
  },
  infoIcon: {
    fontSize: global_FontSize_md.value,
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
});
