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
    marginBottom: global_spacer_md.value,
    display: 'flex',
    alignItems: 'flex-end',
  },
  text: {
    paddingBottom: 14,
    lineHeight: global_LineHeight_sm.value,
    fontSize: global_FontSize_xs.value,
  },
  value: {
    color: global_Color_100.var,
    marginRight: global_spacer_sm.value,
    fontSize: global_FontSize_4xl.value,
  },
  valueContainer: {
    display: 'inline-block',
    marginBottom: global_spacer_md.value,
    width: '50%',
    wordWrap: 'break-word',
  },
});
