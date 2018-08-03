import { StyleSheet } from '@patternfly/react-styles';
import {
  global_FontSize_4xl,
  global_FontSize_xs,
  global_LineHeight_sm,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  reportSummaryDetails: {
    paddingBottom: global_spacer_md.value,
    marginBottom: global_spacer_md.value,
    display: 'flex',
    alignItems: 'center',
  },
  value: {
    marginRight: global_spacer_sm.value,
    fontSize: global_FontSize_4xl.value,
  },
  text: {
    lineHeight: global_LineHeight_sm.value,
    fontSize: global_FontSize_xs.value,
  },
});
