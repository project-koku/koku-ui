import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BorderColor,
  global_BorderColor_active,
  global_BorderWidth_md,
  global_BorderWidth_sm,
  global_danger_color_100,
  global_danger_color_200,
  global_FontSize_md,
  global_spacer_sm,
  global_spacer_xl,
  global_spacer_xs,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    fontSize: global_FontSize_md.value,
    paddingTop: global_spacer_xs.value,
    paddingRight: global_spacer_xl.value,
    paddingBottom: global_spacer_xs.value,
    paddingLeft: global_spacer_sm.value,
    lineHeight: '24px',
    outline: 0,
    border: `${global_BorderWidth_sm.value} solid ${global_BorderColor.value}`,
    ':focus': {
      borderColor: global_BorderColor_active.value,
    },
  },
  flat: {
    border: 'none',
    borderBottom: [
      global_BorderWidth_sm.value,
      'solid',
      global_BorderColor.value,
    ].join(' '),
    ':focus': {
      borderBottom: [
        global_BorderWidth_md.value,
        'solid',
        global_BorderColor_active.value,
      ].join(' '),
    },
  },
  error: {
    borderColor: global_danger_color_100.value,
    ':focus': {
      borderColor: global_danger_color_200.value,
    },
  },
});
