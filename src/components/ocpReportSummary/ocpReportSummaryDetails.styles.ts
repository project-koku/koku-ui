import { StyleSheet } from '@patternfly/react-styles';
import {
  global_Color_100,
  global_FontSize_4xl,
  global_FontSize_xs,
  global_LineHeight_sm,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  reportSummaryDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: global_spacer_md.value,
  },
  value: {
    display: 'flex',
    color: global_Color_100.var,
    fontSize: global_FontSize_4xl.value,
    marginRight: global_spacer_sm.value,
  },
  text: {
    display: 'flex',
    alignItems: 'flex-end',
    marginLeft: global_spacer_sm.value,
    paddingBottom: 14,
    lineHeight: global_LineHeight_sm.value,
    fontSize: global_FontSize_xs.value,
  },
});
