import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BorderColor,
  global_BorderWidth_sm,
  global_FontSize_xs,
  global_FontSize_xxxxl,
  global_LineHeight_sm,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  reportSummaryDetails: {
    paddingBottom: global_spacer_md.value,
    marginBottom: global_spacer_md.value,
    borderBottom: [
      global_BorderWidth_sm.value,
      'solid',
      global_BorderColor.value,
    ].join(' '),
    display: 'flex',
    alignItems: 'center',
  },
  value: {
    marginRight: global_spacer_sm.value,
    fontSize: global_FontSize_xxxxl.value,
  },
  text: {
    lineHeight: global_LineHeight_sm.value,
    fontSize: global_FontSize_xs.value,
  },
});
